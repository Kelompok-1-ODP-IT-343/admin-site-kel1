"use client"

import {
  Check, X, Calculator, FileDown, Settings2, Info, XCircle,
  Plus, Trash2, User2, Wallet, BarChart3, FileText, Download, Send, Eye
} from "lucide-react";
import React, { JSX, useMemo, useState, useEffect, Suspense } from "react";
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
// } from "recharts";
// import { Check, X, Calculator, FileDown, Settings2, Info, XCircle, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { customers } from "@/components/data/approvekpr"
import { getPengajuanDetail } from "@/services/approvekpr"
import { getCreditScore } from "@/services/creditScore"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import AssignApprovalDialog from "@/components/dialogs/AssignTo";
// import jsPDF from "jspdf"
// import html2canvas from "html2canvas"
import ViewDocumentDialog from "@/components/dialogs/ViewDocumentDialog";


// ----- Types -----
type Scheme = "flat-floating" | "all-flat" | "all-float";
type Row = {
  month: number;
  principalComponent: number;
  interestComponent: number;
  payment: number;
  balance: number;
  rateApplied: number;
};

// tambahan type baru
type RateSegment = {
  start: number;
  end: number;
  rate: number;
  label?: string
};

// ----- Component -----
function SimulateContent(): JSX.Element {
  const router = useRouter()
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  // Tambah state untuk loading & data pengajuan dari API
  const [loading, setLoading] = useState(true)
  const [pengajuan, setPengajuan] = useState<any | null>(null)
  const [openKtp, setOpenKtp] = useState(false)
  const [openSlip, setOpenSlip] = useState(false)

  // Fetch data pengajuan saat page dimount
  useEffect(() => {
    if (!id) return;
    async function fetchDetail() {
      try {
        const result = await getPengajuanDetail(Number(id));
        // pastikan format datanya aman
        const safeData =
          result?.data ??
          (result?.success ? result.data : result) ??
          null;

        console.log("✅ Data pengajuan:", safeData);
        setPengajuan(safeData);
        // Fetch credit score once after we have pengajuan detail
        try {
          const uid = (safeData?.userInfo?.id as any) ?? idNum
          if (uid) {
            setCreditLoading(true)
            setCreditError(null)
            const cs = await getCreditScore(uid)
            if (cs && typeof cs.score === "number") {
              setCreditScore(Math.round(cs.score))
            } else {
              setCreditError("Score tidak tersedia")
            }
          }
        } catch (err) {
          console.error("Gagal mengambil credit score:", err)
          setCreditError("Gagal mengambil credit score")
        } finally {
          setCreditLoading(false)
        }
      } catch (err) {
        console.error("❌ Gagal fetch pengajuan:", err);
        setPengajuan(null);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [id]);

  const isLoading = loading
  const isError = !loading && !pengajuan
  // Hindari return awal agar urutan Hooks konsisten antar render.
  // Loading dan error akan ditampilkan secara kondisional di dalam JSX utama.
  const {
    userInfo: customer = {},
    propertyInfo: property = {},
    documents = [],
    loanTermYears = 0,
    loanAmount = 0,
  } = pengajuan ?? {};
  //Extract data dari response API
  // const customer = pengajuan?.userInfo
  // const property = pengajuan?.propertyInfo
  // const documents = pengajuan?.documents || []
  const ktp = documents.find((d: any) => d.documentType === "KTP")?.filePath
  const slip = documents.find((d: any) => d.documentType === "SLIP_GAJI")?.filePath
  
  // --- FICO score integration ---
  const idNum = parseInt(id ?? "1", 10)
  const seededRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000
    return x - Math.floor(x)
  }
  const fallbackScore: number = Math.floor(300 + seededRandom(idNum) * 550)
  const [creditScore, setCreditScore] = useState<number | null>(null)
  const [creditLoading, setCreditLoading] = useState(false)
  const [creditError, setCreditError] = useState<string | null>(null)

  const score = creditScore ?? fallbackScore

  // pakai data dari API:
  customer?.fullName ?? "-"
  customer?.email ?? "-"
  customer?.phone ?? "-"

  // properti simulasi default
  const [startFloatAt, setStartFloatAt] = useState<number>(13)
  const [flatRate, setFlatRate] = useState<number>(5.99)
  const [floatRate, setFloatRate] = useState<number>(13.5)
  const [scheme, setScheme] = useState<Scheme>("flat-floating")

  // contoh nilai awal diambil dari API kalau ada
  const [hargaProperti, setHargaProperti] = useState(property?.price || 850_000_000)
  const [persenDP, setPersenDP] = useState(20)
  const [jangkaWaktu, setJangkaWaktu] = useState(pengajuan?.loanTermYears || 20)
  const tenor = jangkaWaktu * 12

  // ---- fitur baru: multi rate adjustment ----
  const [rateSegments, setRateSegments] = useState<RateSegment[]>([
    { start: 1, end: 12, rate: 5.99 },
    { start: 13, end: 240, rate: 13.5 },
  ])
  // --------------------------------------------

  const colors = {
    blue: "#3FD8D4",
    gray: "#757575",
    orange: "#FF8500",
  } as const

  function roundIDR(n: number): number {
    return Math.round(n)
  }

  // ====== Perhitungan amortisasi berdasarkan segmen bunga ======
  function buildMultiSegmentSchedule(
    principal: number,
    segments: { start: number; end: number; rate: number }[]
  ): Row[] {
    const rows: Row[] = []
    let balance = principal

    for (let s = 0; s < segments.length; s++) {
      const seg = segments[s]
      const months = seg.end - seg.start + 1
      if (months <= 0 || balance <= 0) continue

      const r = seg.rate / 100 / 12

      // hitung ulang payment memakai saldo tersisa dari segmen sebelumnya
      const pay = (balance * r) / (1 - Math.pow(1 + r, -(months + (segments.length - s - 1) * 12)))

      for (let i = 0; i < months; i++) {
        const interest = balance * r
        const principalComp = pay - interest
        balance -= principalComp
        if (balance < 0) balance = 0

        rows.push({
          month: seg.start + i,
          principalComponent: principalComp,
          interestComponent: interest,
          payment: pay,
          balance,
          rateApplied: seg.rate,
        })
      }
    }

    return rows
  }

  // ====== Kalkulasi total ======
  const rows = useMemo(() => {
    if (rateSegments.length === 0) return []
    return buildMultiSegmentSchedule(loanAmount, rateSegments)
  }, [loanAmount, rateSegments, tenor])

  const totalPayment = useMemo(
    () => rows.reduce((sum, r) => sum + r.payment, 0),
    [rows]
  )
  const totalInterest = useMemo(
    () => rows.reduce((sum, r) => sum + r.interestComponent, 0),
    [rows]
  )
  const pageSize = 12
  const [page, setPage] = useState(1)
  const paged = rows.slice((page - 1) * pageSize, page * pageSize)
  const maxPage = Math.ceil(rows.length / pageSize)



  // function buildHybridSchedule(): Row[] {
  //   // kalau pakai fitur multi-rate, override
  //   if (rateSegments.length > 1) {
  //     return buildMultiSegmentSchedule();
  //   }

  //   if (scheme === "all-flat") return buildFlatSchedule(loanAmount, tenor, flatRate);
  //   if (scheme === "all-float") return buildAnnuitySchedule(loanAmount, tenor, floatRate, 1);

  //   const flatMonths = Math.max(1, Math.min(startFloatAt - 1, tenor - 1));
  //   const flatRows = buildFlatSchedule(loanAmount, flatMonths, flatRate);
  //   const balanceAfterFlat = flatRows[flatRows.length - 1]?.balance ?? loanAmount;
  //   const remaining = tenor - flatMonths;
  //   const floatRows = buildAnnuitySchedule(balanceAfterFlat, remaining, floatRate, flatMonths + 1);
  //   return [...flatRows, ...floatRows];
  // }

  // const rows: Row[] = useMemo<Row[]>(() => buildHybridSchedule(), [
  //   loanAmount, tenor, startFloatAt, flatRate, floatRate, scheme, rateSegments,
  // ]);

  // const totalPayment = useMemo(() => rows.reduce((s, r) => s + r.payment, 0), [rows]);
  // const totalInterest = useMemo(() => rows.reduce((s, r) => s + r.interestComponent, 0), [rows]);
  // const paged = rows.slice((page - 1) * pageSize, page * pageSize);
  // const maxPage = Math.ceil(rows.length / pageSize);

  const getCreditStatusColor = (status: string) => {
    switch (status) {
      case "Lancar": return "text-green-600 bg-green-100";
      case "Dalam Perhatian Khusus": return "text-yellow-600 bg-yellow-100";
      case "Kurang Lancar": return "text-orange-600 bg-orange-100";
      case "Diragukan": return "text-red-600 bg-red-100";
      case "Macet": return "text-red-700 bg-red-200";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const chartData = rows.map((r) => ({
    month: r.month,
    payment: Math.round(r.payment),
  }));

  // === State baru ===
  const [developerType, setDeveloperType] = useState<"A" | "B">("A")
  const [schemeType, setSchemeType] = useState<"single_fixed" | "tiered">("single_fixed")
  const [selectedRates, setSelectedRates] = useState<Record<string, number>>({})

  type RateTable = Record<string, number>
  type DeveloperRates = Record<string, RateTable>
  type RateScheme = Record<"A" | "B", DeveloperRates>
  // === Data referensi ===
  const rateData: Record<
    "single_fixed" | "tiered",
    Record<"A" | "B", Record<string, Record<string, number>>>
  > = {
    single_fixed: {
      A: {
        "1":  { "Bunga Tetap 1 Tahun": 7.75 },
        "2":  { "Bunga Tetap 2 Tahun": 7.75 },
        "3":  { "Bunga Tetap 1 Tahun": 2.75, "Bunga Tetap 3 Tahun": 7.75 },
        "4":  { "Bunga Tetap 4 Tahun": 8.00 },
        "5":  { "Bunga Tetap 3 Tahun": 6.75, "Bunga Tetap 5 Tahun": 8.00 },
        "6":  { "Bunga Tetap 6 Tahun": 8.00 },
        "7":  { "Bunga Tetap 7 Tahun": 8.00 },
        "8":  { "Bunga Tetap 8 Tahun": 8.00 },
        "9":  { "Bunga Tetap 9 Tahun": 8.25 },
        "10": { "Bunga Tetap 3 Tahun": 3.75, "Bunga Tetap 5 Tahun": 5.75, "Bunga Tetap 10 Tahun": 8.25 },
        "12": { "Bunga Tetap 5 Tahun": 4.75 },
        "15": { "Bunga Tetap 3 Tahun": 2.75, "Bunga Tetap 5 Tahun": 3.75 },
        "20": { "Bunga Tetap 3 Tahun": 4.00, "Bunga Tetap 5 Tahun": 6.00, "Bunga Tetap 10 Tahun": 8.50 },
        "25": { "Bunga Tetap 3 Tahun": 4.25, "Bunga Tetap 5 Tahun": 6.25, "Bunga Tetap 10 Tahun": 8.75 },
        "30": { "Bunga Tetap 3 Tahun": 4.50, "Bunga Tetap 5 Tahun": 6.50, "Bunga Tetap 10 Tahun": 9.00 }
      },
      B: {
        "1":  { "Bunga Tetap 1 Tahun": 8.00 },
        "2":  { "Bunga Tetap 2 Tahun": 8.00 },
        "3":  { "Bunga Tetap 1 Tahun": 3.25, "Bunga Tetap 3 Tahun": 8.00 },
        "4":  { "Bunga Tetap 4 Tahun": 8.25 },
        "5":  { "Bunga Tetap 3 Tahun": 7.25, "Bunga Tetap 5 Tahun": 8.25 },
        "6":  { "Bunga Tetap 6 Tahun": 8.25 },
        "7":  { "Bunga Tetap 7 Tahun": 8.25 },
        "8":  { "Bunga Tetap 8 Tahun": 8.25 },
        "9":  { "Bunga Tetap 9 Tahun": 8.75 },
        "10": { "Bunga Tetap 3 Tahun": 4.25, "Bunga Tetap 5 Tahun": 6.25, "Bunga Tetap 10 Tahun": 8.75 },
        "12": { "Bunga Tetap 5 Tahun": 5.25 },
        "15": { "Bunga Tetap 3 Tahun": 3.25, "Bunga Tetap 5 Tahun": 4.25 },
        "20": { "Bunga Tetap 3 Tahun": 4.75, "Bunga Tetap 5 Tahun": 6.75, "Bunga Tetap 10 Tahun": 9.25 },
        "25": { "Bunga Tetap 3 Tahun": 5.25, "Bunga Tetap 5 Tahun": 7.25, "Bunga Tetap 10 Tahun": 9.75 },
        "30": { "Bunga Tetap 3 Tahun": 5.75, "Bunga Tetap 5 Tahun": 7.75, "Bunga Tetap 10 Tahun": 10.25 }
      },
    },

    tiered: {
      A: {
        "10": { "Tahun ke 1": 2.75, "Tahun ke 2": 4.75, "Tahun ke 3": 6.75, "Tahun ke 4": 8.75, "Tahun ke 5-10": 10.75 },
        "15": { "Tahun ke 1": 2.75, "Tahun ke 2-3": 4.75, "Tahun ke 4-5": 6.75, "Tahun ke 6-7": 8.75, "Tahun ke 8-10": 10.75 },
        "20": { "Tahun ke 1": 3.00, "Tahun ke 2-3": 5.00, "Tahun ke 4-5": 7.00, "Tahun ke 6-10": 9.00, "Tahun ke 11-15": 10.50, "Tahun ke 16-20": 11.00 },
        "25": { "Tahun ke 1": 3.25, "Tahun ke 2-3": 5.25, "Tahun ke 4-5": 7.25, "Tahun ke 6-10": 9.25, "Tahun ke 11-15": 10.75, "Tahun ke 16-20": 11.25, "Tahun ke 21-25": 11.75 },
        "30": { "Tahun ke 1": 3.50, "Tahun ke 2-3": 5.50, "Tahun ke 4-5": 7.50, "Tahun ke 6-10": 9.50, "Tahun ke 11-15": 11.00, "Tahun ke 16-20": 11.50, "Tahun ke 21-25": 12.00, "Tahun ke 26-30": 12.50 }
      },
      B: {
        "10": { "Tahun ke 1": 3.25, "Tahun ke 2": 5.25, "Tahun ke 3": 7.25, "Tahun ke 4": 9.25, "Tahun ke 5-10": 11.25 },
        "15": { "Tahun ke 1": 3.25, "Tahun ke 2-3": 5.25, "Tahun ke 4-5": 7.25, "Tahun ke 6-7": 9.25, "Tahun ke 8-10": 11.25 },
        "20": { "Tahun ke 1": 3.50, "Tahun ke 2-3": 5.50, "Tahun ke 4-5": 7.50, "Tahun ke 6-10": 9.50, "Tahun ke 11-15": 11.50, "Tahun ke 16-20": 12.00 },
        "25": { "Tahun ke 1": 3.75, "Tahun ke 2-3": 5.75, "Tahun ke 4-5": 7.75, "Tahun ke 6-10": 9.75, "Tahun ke 11-15": 11.75, "Tahun ke 16-20": 12.25, "Tahun ke 21-25": 12.75 },
        "30": { "Tahun ke 1": 4.25, "Tahun ke 2-3": 6.25, "Tahun ke 4-5": 8.25, "Tahun ke 6-10": 10.25, "Tahun ke 11-15": 12.25, "Tahun ke 16-20": 12.75, "Tahun ke 21-25": 13.25, "Tahun ke 26-30": 13.75 }
      },
    },
  } 

  React.useEffect(() => {
    const data = rateData[schemeType]?.[developerType]?.[String(jangkaWaktu)];
    if (!data) {
      setSelectedRates({});
      setRateSegments([]);
      return;
    }

    setSelectedRates(data);

    // 🔹 SINGLE FIXED → manual pilih segmen
    if (schemeType === "single_fixed") {
      const segments: RateSegment[] = [];
      let totalYears = 0;

      Object.entries(data).forEach(([label, rate]) => {
        const match = label.match(/(\d+)/);
        const years = match ? parseInt(match[1]) : 0;
        const start = totalYears * 12 + 1;
        const end = (totalYears + years) * 12;
        segments.push({ start, end, rate: rate as number, label });
        totalYears += years;
      });

      if (totalYears < jangkaWaktu) {
        segments.push({
          start: totalYears * 12 + 1,
          end: jangkaWaktu * 12,
          rate: 0,
          label: "Bunga Floating",
        });
      }

      setRateSegments(segments);
    }

    // 🔹 TIERED → otomatis parse "Tahun ke X" dan "Tahun ke X-Y"
    if (schemeType === "tiered") {
      const segments: RateSegment[] = [];

      Object.entries(data).forEach(([label, rate]) => {
        // Contoh label: "Tahun ke 1", "Tahun ke 2-3", "Tahun ke 4-5", "Tahun ke 6-10"
        const match = label.match(/Tahun ke (\d+)(?:-(\d+))?/i);
        if (match) {
          const startYear = parseInt(match[1]);
          const endYear = match[2] ? parseInt(match[2]) : startYear;
          const start = (startYear - 1) * 12 + 1;
          const end = endYear * 12;
          segments.push({
            start,
            end,
            rate: rate as number,
            label,
          });
        }
      });

      setRateSegments(segments);
    }

  }, [developerType, schemeType, jangkaWaktu]);
  const indonesianMonths = [
    "Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"
  ];
  function formatDateIndo(s?: string): string {
    if (!s) return "-";
    const d = new Date(s);
    if (isNaN(d.getTime())) return s as string;
    const day = d.getDate();
    const month = indonesianMonths[d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  }
  const preserveAcronyms = new Set(["BUMN","BUMD","TNI","POLRI","DKI","DIY"]);
  function formatTitle(s?: string): string {
    if (!s) return "-";
    const parts = s.trim().split(/\s+/);
    return parts.map(w => {
      const up = w.toUpperCase();
      if (preserveAcronyms.has(up)) return up;
      const lw = w.toLowerCase();
      return lw.charAt(0).toUpperCase() + lw.slice(1);
    }).join(" ");
  }
  function formatGender(g?: string): string {
    const t = (g || "").toUpperCase();
    if (t === "MALE") return "Laki-Laki";
    if (t === "FEMALE") return "Perempuan";
    return g ?? "-";
  }
  function formatOccupation(s?: string): string {
    if (!s) return "-";
    const tokens = s.replace(/_/g, " ").split(" ");
    return tokens.map(w => {
      const up = w.toUpperCase();
      if (preserveAcronyms.has(up)) return up;
      const lw = w.toLowerCase();
      return lw.charAt(0).toUpperCase() + lw.slice(1);
    }).join(" ");
  }
  function formatYears(x?: number | string): string {
    if (x === undefined || x === null) return "-";
    const n = typeof x === "string" ? parseInt(x, 10) : x;
    if (!Number.isFinite(n as number)) return "-";
    return `${n} Tahun`;
  }
  function formatIDR(x?: number | string): string {
    if (x === undefined || x === null || x === "") return "-";
    const n = typeof x === "string" ? Number(x) : x;
    if (!Number.isFinite(n as number)) return "-";
    return `Rp ${Number(n).toLocaleString("id-ID")}`;
  }
  function formatPct(x?: number | string): string {
    if (x === undefined || x === null || x === "") return "-";
    const n = typeof x === "string" ? Number(x) : x;
    if (!Number.isFinite(n as number)) return "-";
    return `${Math.round(Number(n) * 100)}%`;
  }
  function formatDate(s?: string): string {
    if (!s) return "-";
    const d = new Date(s);
    if (isNaN(d.getTime())) return s as string;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  }

  return (

    <div className="approval-page min-h-screen bg-white text-gray-700 relative">


      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b bg-white"
        style={{ borderColor: colors.blue }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 relative">
          <div className="flex items-center gap-3">
            <div className="h-30 w-30 rounded-xl overflow-hidden">
              <img
                src="/logo-satuatap.png"   // <== ganti sesuai lokasi gambarnya
                alt="Satu Atap Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="font-semibold text-lg text-black">
                Approval Detail KPR
              </h1>
              <p className="text-xs">Satu Atap Admin • Simulasi Suku Bunga</p>
            </div>
          </div>


          {/* Tombol Close di pojok kanan atas */}
          <button
            onClick={() => router.push("/dashboard")}
            className="absolute right-6 top-3 flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
          >
            <XCircle className="h-6 w-6" /> Close
          </button>

        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {isLoading && (
          <div className="p-10 text-center text-muted-foreground">
            Memuat data pengajuan...
          </div>
        )}


        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl shadow-sm border flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <User2 className="h-7 w-7 text-[#3FD8D4]" />
              <p className="text-base font-semibold">Nasabah</p>
            </div>
            <h3 className="font-semibold text-black text-lg">{customer.fullName}</h3>
            <p className="flex text-sm text-gray-600">{customer.email} • {customer.phone}</p>
          </div>
          <div className="p-5 rounded-2xl shadow-sm border flex flex-col" style={{ borderColor: colors.gray + "33" }}>
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="h-7 w-7" color={colors.blue} />
              <p className="text-xs">Plafon</p>
            </div>
            <h3 className="font-semibold text-black text-lg">Rp{loanAmount.toLocaleString("id-ID")}</h3>
            <p>Tenor {tenor} bulan</p>
          </div>
          {/* FICO */}
          <div
            className="p-5 rounded-2xl shadow-sm border flex flex-col"
            style={{ borderColor: colors.gray + "33" }}
          >
            {/* === Header kiri === */}
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-7 w-7" color={colors.blue} />
              <p className="text-xs font-medium">FICO® Score</p>
            </div>

            {creditLoading ? (
              <div className="flex justify-center">
                <Skeleton className="w-40 h-20 rounded-xl" />
              </div>
            ) : (
              <div className="flex justify-center">
                <div className="relative w-40 h-20">
                  <svg viewBox="0 0 100 50" className="w-full h-full">
                    <path
                      d="M10 50 A40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#E5E7EB"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10 50 A40 40 0 0 1 90 50"
                      fill="none"
                      stroke={
                        score <= 560 ? "#EF4444" :
                        score <= 650 ? "#F97316" :
                        score <= 700 ? "#EAB308" :
                        score <= 750 ? "#3B82F6" :
                        "#22C55E"
                      }
                      strokeWidth="8"
                      strokeDasharray={`${((score - 300) / 550) * 126} 126`}
                      strokeLinecap="round"
                    />
                    <text
                      x="50"
                      y="32"
                      textAnchor="middle"
                      fontSize="14"
                      fontWeight="800"
                      fill="#111827"
                    >
                      {score}
                    </text>
                    <text
                      x="50"
                      y="44"
                      textAnchor="middle"
                      fontSize="7"
                      fontWeight="600"
                      fill={
                        score <= 560 ? "#dc2626" :
                        score <= 650 ? "#ea580c" :
                        score <= 700 ? "#ca8a04" :
                        score <= 750 ? "#2563eb" :
                        "#16a34a"
                      }
                    >
                      {score <= 560
                        ? "Very Bad"
                        : score <= 650
                          ? "Bad"
                          : score <= 700
                            ? "Fair"
                            : score <= 750
                              ? "Good"
                              : "Excellent"}
                    </text>
                  </svg>
                </div>
              </div>
            )}
            {creditError && (
              <p className="mt-2 text-xs text-red-600">{creditError}</p>
            )}
            {creditLoading && !creditError && (
              <p className="mt-2 text-xs text-muted-foreground">Mengambil credit score...</p>
            )}
          </div>



        </section>

        {/* === Detail Customer === */}
        {customer && (
          <section
            className="border rounded-2xl p-5 bg-white shadow-sm"
            style={{ borderColor: colors.gray + "33" }}
          >
            <h2 className="font-semibold text-black text-lg mb-4 flex items-center gap-2">
              <User2 className="h-6 w-6 text-[#3FD8D4]" /> Detail Customer
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* KIRI - Data Profil */}
              <div className="border rounded-xl p-4 bg-card shadow-sm">
                <h3 className="font-semibold text-base mb-3 text-gray-900 dark:!text-white">
                  Data Profil
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Nama Lengkap</span>
                    <span className="font-medium text-right">{customer?.fullName ?? "-"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Username</span>
                    <span className="font-medium text-right">{customer?.username ?? "-"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium text-right">{customer?.email ?? "-"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Telepon</span>
                    <span className="font-medium text-right">{customer?.phone ?? "-"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">NIK</span>
                    <span className="font-medium text-right">{customer?.nik ?? "-"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">NPWP</span>
                    <span className="font-medium text-right">{customer?.npwp ?? "-"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Tempat/Tgl Lahir</span>
                    <span className="font-medium text-right">
                      {formatTitle(customer?.birthPlace)}, {formatDateIndo(customer?.birthDate)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Jenis Kelamin</span>
                    <span className="font-medium text-right">{formatGender(customer?.gender)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-right">{formatTitle(customer?.maritalStatus)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Alamat</span>
                    <span className="font-medium text-right w-[55%] text-right">
                      {customer?.address ?? "-"}, {formatTitle(customer?.city)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Provinsi</span>
                    <span className="font-medium text-right">{formatTitle(customer?.province)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kode Pos</span>
                    <span className="font-medium text-right">{customer?.postalCode ?? "-"}</span>
                  </div>
                </div>
              </div>

              {/* KANAN - Data Pekerjaan */}
              <div className="border rounded-xl p-4 bg-card shadow-sm">
                <h3 className="font-semibold text-base mb-3 text-gray-900 dark:!text-white">
                  Data Pekerjaan
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Pekerjaan</span>
                    <span className="font-medium text-right">{formatOccupation(customer?.occupation)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Pendapatan Bulanan</span>
                    <span className="font-medium text-right">
                      Rp {customer?.monthlyIncome?.toLocaleString("id-ID") ?? "-"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Nama Perusahaan</span>
                    <span className="font-medium text-right">{customer?.companyName ?? "-"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Alamat Perusahaan</span>
                    <span className="font-medium text-right w-[55%] text-right">
                      {customer?.companyAddress ?? "-"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Kota Perusahaan</span>
                    <span className="font-medium text-right">{formatTitle(customer?.companyCity)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Provinsi Perusahaan</span>
                    <span className="font-medium text-right">{formatTitle(customer?.companyProvince)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Kode Pos Perusahaan</span>
                    <span className="font-medium text-right">{customer?.companyPostalCode ?? "-"}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Kecamatan Perusahaan</span>
                    <span className="font-medium text-right">{formatTitle(customer?.companyDistrict)}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Kelurahan Perusahaan</span>
                    <span className="font-medium text-right">{formatTitle(customer?.companySubdistrict)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pengalaman Kerja</span>
                    <span className="font-medium text-right">{formatYears(customer?.workExperience)}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
        {/* Data Pengajuan KPR & Data Properti */}
        <section className="border rounded-2xl p-5 bg-white shadow-sm" style={{ borderColor: colors.gray + "33" }}>
          <h2 className="font-semibold text-black text-lg mb-4 flex items-center gap-2">
            <FileText className="h-6 w-6 text-[#3FD8D4]" /> Data Pengajuan KPR
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-xl p-4 bg-card shadow-sm">
              <h3 className="font-semibold text-base mb-3 text-gray-900">Data Pengajuan</h3>
              <div className="space-y-2 text-sm">
                {[
                  ["Nilai Properti", formatIDR(property?.price)],
                  ["Alamat Properti", property?.address ?? "-"],
                  ["Jenis Sertifikat", property?.certificateType ?? "-"],
                  ["Plafon (Loan Amount)", formatIDR(loanAmount)],
                  [
                    "Tenor",
                    (() => {
                      const lt = Number(pengajuan?.loanTermYears);
                      if (!lt || Number.isNaN(lt)) return "-";
                      return `${lt} tahun`;
                    })(),
                  ],
                  ["Suku Bunga", pengajuan?.interestRate != null ? `${Number(pengajuan?.interestRate) * 100}%` : "-"],
                  ["DP (Down Payment)", formatIDR(pengajuan?.downPayment)],
                  [
                    "Rasio LTV",
                    (() => {
                      const price = Number(property?.price);
                      const loan = Number(loanAmount);
                      if (!price || !loan || Number.isNaN(price) || Number.isNaN(loan)) return "-";
                      return formatPct(loan / price);
                    })(),
                  ],
                  ["Tujuan", pengajuan?.purpose ?? "-"],
                  ["Diajukan", formatDate(pengajuan?.submittedAt ?? pengajuan?.tanggal)],
                  ["Catatan", pengajuan?.notes ?? "-"],
                ].map(([label, value]) => (
                  <div key={label as string} className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">{label as string}</span>
                    <span className="font-medium text-right max-w-[55%]">{value as string}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border rounded-xl p-4 bg-card shadow-sm">
              <h3 className="font-semibold text-base mb-3 text-gray-900">Data Properti</h3>
              {(() => {
                const p: any = property;
                if (!p) {
                  return <p className="text-sm text-muted-foreground">Informasi properti tidak tersedia.</p>;
                }
                return (
                  <div className="space-y-2 text-sm">
                    {[
                      ["Kode Properti", p.propertyCode ?? "-"],
                      ["Judul", p.title ?? "-"],
                      ["Deskripsi", p.description ?? "-"],
                      ["Alamat", p.address ?? "-"],
                      ["Kota", p.city ?? "-"],
                      ["Provinsi", p.province ?? "-"],
                      ["Kode Pos", p.postalCode ?? "-"],
                      ["Kecamatan", p.district ?? "-"],
                      ["Kelurahan", p.subDistrict ?? p.village ?? "-"],
                      ["Luas Tanah", p.landArea != null ? `${p.landArea} m²` : "-"],
                      ["Luas Bangunan", p.buildingArea != null ? `${p.buildingArea} m²` : "-"],
                      ["Kamar Tidur", p.bedrooms ?? "-"],
                      ["Kamar Mandi", p.bathrooms ?? "-"],
                      ["Lantai", p.floors ?? "-"],
                      ["Garasi", p.garage ?? "-"],
                      ["Tahun Dibangun", p.yearBuilt ?? "-"],
                      ["Harga", formatIDR(p.price)],
                      ["Harga/m²", formatIDR(p.pricePerSqm)],
                      ["Jenis Sertifikat", p.certificateType ?? "-"],
                      ["Nomor Sertifikat", p.certificateNumber ?? "-"],
                      ["PBB", formatIDR(p.pbbValue)],
                    ].map(([label, value]) => (
                      <div key={label as string} className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">{label as string}</span>
                        <span className="font-medium text-right max-w-[55%]">{value as string}</span>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </section>

        {isError && (
          <div className="p-10 text-center text-red-500">
            ❌ Data pengajuan tidak ditemukan
          </div>
        )}
        {/* === Dokumen Pendukung === */}
        {customer && (
          <section className="border rounded-2xl p-5 bg-white shadow-sm">
            <h2 className="font-semibold text-black text-lg mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-[#3FD8D4]" /> Dokumen Pendukung
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="border rounded-xl p-5 shadow-sm bg-gray-50 flex items-center justify-between">
                <p className="font-semibold text-gray-800 text-base">Kartu Tanda Penduduk (KTP)</p>
                <Button
                  onClick={() => setOpenKtp(true)}
                  variant="outline"
                  className="text-[#0B63E5] border-[#0B63E5]/60 hover:bg-[#0B63E5]/10 font-semibold shadow-sm"
                >
                  <Eye className="mr-2 h-4 w-4" /> Lihat KTP
                </Button>
              </div>

              <div className="border rounded-xl p-5 shadow-sm bg-gray-50 flex items-center justify-between">
                <p className="font-semibold text-gray-800 text-base">Slip Gaji</p>
                <Button
                  onClick={() => setOpenSlip(true)}
                  variant="outline"
                  className="text-[#0B63E5] border-[#0B63E5]/60 hover:bg-[#0B63E5]/10 font-semibold shadow-sm"
                >
                  <Eye className="mr-2 h-4 w-4" /> Lihat Slip Gaji
                </Button>
              </div>
            </div>

            <ViewDocumentDialog open={openKtp} onOpenChange={setOpenKtp} title="KTP" imageUrl={ktp || null} />
            <ViewDocumentDialog open={openSlip} onOpenChange={setOpenSlip} title="Slip Gaji" imageUrl={slip || null} />
          </section>

        )}


        {/* Actions */}
        {/* === Bagian Assign To === */}
        <section className="flex flex-wrap justify-end mt-8">
          <AssignApprovalDialog />
        </section>

      </main>
    </div>
  );
}

export default function ApprovalDetailMockup(): JSX.Element {
  return (
    <Suspense fallback={<></>}>
      <SimulateContent />
    </Suspense>
  );
}

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"
