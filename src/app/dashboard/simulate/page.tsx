"use client"

import {
  Check, X, Calculator, FileDown, Settings2, Info, XCircle,
  Plus, Trash2, User2, Wallet, BarChart3, FileText, Download, Send, Eye
} from "lucide-react";
import React, { JSX, useMemo, useState } from "react";
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
// } from "recharts";
// import { Check, X, Calculator, FileDown, Settings2, Info, XCircle, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { customers } from "@/components/data/approvekpr"
import { Button } from "@/components/ui/button"
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
export default function ApprovalDetailMockup(): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  
  // --- FICO score (seeded by URL id) ---
  const idNum = parseInt(searchParams.get("id") ?? "1", 10);

  const seededRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const score: number = Math.floor(300 + seededRandom(idNum) * 550);
  const scoreLabel =
    score >= 740 ? "Excellent" :
    score >= 670 ? "Good" :
    score >= 580 ? "Fair" :
    "Poor";

  // cari customer berdasarkan ID
  const customer = customers.find(c => c.id === id);

  const name = customer?.name || "Tidak Diketahui";
  const email = customer?.email || "unknown@example.com";
  const phone = customer?.phone || "-";


  const [openKtp, setOpenKtp] = useState(false);
  const [openSlip, setOpenSlip] = useState(false);

  // const [loanAmount, setLoanAmount] = useState<number>(850_000_000);
  // const [tenor, setTenor] = useState<number>(240);
  const [startFloatAt, setStartFloatAt] = useState<number>(13);
  const [flatRate, setFlatRate] = useState<number>(5.99);
  const [floatRate, setFloatRate] = useState<number>(13.5);
  const [scheme, setScheme] = useState<Scheme>("flat-floating");
  // const [page, setPage] = useState<number>(1);
  // const pageSize = 12;
  const [hargaProperti, setHargaProperti] = useState(850_000_000);
  const [persenDP, setPersenDP] = useState(20);
  const [jangkaWaktu, setJangkaWaktu] = useState(20);
  const tenor = jangkaWaktu * 12;
  const loanAmount = hargaProperti * (1 - persenDP / 100);


  // ---- fitur baru: multi rate adjustment ----
  const [rateSegments, setRateSegments] = useState<RateSegment[]>([
    { start: 1, end: 12, rate: 5.99 },
    { start: 13, end: 240, rate: 13.5 },
  ]);
  // --------------------------------------------

  const colors = {
    blue: "#3FD8D4",
    gray: "#757575",
    orange: "#FF8500",
  } as const;

  function roundIDR(n: number): number {
    return Math.round(n);
  }



  // Schedule builders
  // function buildFlatSchedule(P: number, months: number, rateAnnual: number): Row[] {
  //   const rMonthly = rateAnnual / 100 / 12;
  //   const principalPart = P / months;
  //   const interestPart = P * rMonthly;
  //   let balance = P;
  //   const rows: Row[] = [];
  //   for (let m = 1; m <= months; m++) {
  //     const principalPaid = m === months ? balance : principalPart;
  //     const interestPaid = interestPart;
  //     const payment = principalPaid + interestPaid;
  //     balance = Math.max(0, balance - principalPaid);
  //     rows.push({
  //       month: m,
  //       principalComponent: principalPaid,
  //       interestComponent: interestPaid,
  //       payment,
  //       balance,
  //       rateApplied: rateAnnual,
  //     });
  //   }
  //   return rows;
  // }

  // function buildAnnuitySchedule(
  //   P: number,
  //   months: number,
  //   rateAnnual: number,
  //   startMonthIndex: number = 1
  // ): Row[] {
  //   const r = rateAnnual / 100 / 12;
  //   if (months <= 0) return [];
  //   const pay = r === 0 ? P / months : (P * r) / (1 - Math.pow(1 + r, -months));
  //   const rows: Row[] = [];
  //   let balance = P;
  //   for (let i = 1; i <= months; i++) {
  //     const interest = balance * r;
  //     const principal = Math.min(balance, pay - interest);
  //     balance = Math.max(0, balance - principal);
  //     rows.push({
  //       month: startMonthIndex + i - 1,
  //       principalComponent: principal,
  //       interestComponent: interest,
  //       payment: principal + interest,
  //       balance,
  //       rateApplied: rateAnnual,
  //     });
  //   }
  //   return rows;
  // }

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
        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl shadow-sm border flex flex-col" style={{ borderColor: colors.gray + "33" }}>
            <div className="flex items-center gap-2 mb-1">
              <User2 className="h-7 w-7" color={colors.blue} />
              <p className="text-base font-semibold">Nasabah</p>
            </div>
            <h3 className="font-semibold text-black text-lg">{name}</h3>
            <p className="flex text-sm text-gray-600">{email} • {phone}</p>
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

            {/* === Gauge tetap center === */}
            <div className="flex justify-center">
              <div className="relative w-40 h-20">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                  {/* Background arc */}
                  <path
                    d="M10 50 A40 40 0 0 1 90 50"
                    fill="none"
                    stroke="#E5E7EB"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                  {/* Colored arc */}
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

                  {/* Text inside gauge */}
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
                    {score <= 560 ? "Very Bad" :
                    score <= 650 ? "Bad" :
                    score <= 700 ? "Fair" :
                    score <= 750 ? "Good" :
                    "Excellent"}
                  </text>
                </svg>
              </div>
            </div>
          </div>



        </section>

        {/* === Detail Customer === */}
        {customer && (
          <section className="border rounded-2xl p-5 bg-white shadow-sm" style={{ borderColor: colors.gray + "33" }}>
            <h2 className="font-semibold text-black text-lg mb-4 flex items-center gap-2">
              <User2 className="h-6 w-6 text-[#3FD8D4]" /> Detail Customer
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* KIRI - Data Profil */}
              <div className="border rounded-xl p-4 bg-card shadow-sm">
                <h3 className="font-semibold text-base mb-3 text-gray-900 dark:!text-white">
                  Data Profil
                </h3>
                <div></div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Nama Lengkap</span>
                    <span className="font-medium text-right">{customer.name}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Username</span>
                    <span className="font-medium text-right">{customer.username}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium text-right">{customer.email}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Telepon</span>
                    <span className="font-medium text-right">{customer.phone}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">NIK</span>
                    <span className="font-medium text-right">{customer.nik}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">NPWP</span>
                    <span className="font-medium text-right">{customer.npwp}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Tempat/Tgl Lahir</span>
                    <span className="font-medium text-right">
                      {customer.birth_place}, {customer.birth_date}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Jenis Kelamin</span>
                    <span className="font-medium text-right">{customer.gender}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-right">{customer.marital_status}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Alamat</span>
                    <span className="font-medium text-right w-[55%] text-right">
                      {customer.address}, {customer.sub_district}, {customer.district}, {customer.city}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Provinsi</span>
                    <span className="font-medium text-right">{customer.province}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kode Pos</span>
                    <span className="font-medium text-right">{customer.postal_code}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2">
                    <span className="text-muted-foreground">Credit Score (OJK)</span>
                    <span
                      className={`font-medium text-xs px-2 py-0.5 rounded-full ${getCreditStatusColor(
                        customer.credit_status
                      )}`}
                    >
                      {customer.credit_status} (Kode {customer.credit_score})
                    </span>
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
                    <span className="font-medium text-right">{customer.occupation}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Pendapatan Bulanan</span>
                    <span className="font-medium text-right">Rp {customer.monthly_income}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Nama Perusahaan</span>
                    <span className="font-medium text-right">{customer.company_name}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Alamat Perusahaan</span>
                    <span className="font-medium text-right w-[55%] text-right">
                      {customer.company_address}, {customer.company_subdistrict}, {customer.company_district}
                    </span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Kota</span>
                    <span className="font-medium text-right">{customer.company_city}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1">
                    <span className="text-muted-foreground">Provinsi</span>
                    <span className="font-medium text-right">{customer.company_province}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Kode Pos</span>
                    <span className="font-medium text-right">{customer.company_postal_code}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* === Dokumen Pendukung === */}
        {customer && (
          <section
            className="border rounded-2xl p-5 bg-white shadow-sm"
            style={{ borderColor: colors.gray + "33" }}
          >
            <h2 className="font-semibold text-black text-lg mb-4 flex items-center gap-2">
              <FileText className="h-6 w-6 text-[#3FD8D4]" /> Dokumen Pendukung
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* KTP */}
              <div className="border rounded-xl p-5 shadow-sm bg-gray-50 flex items-center justify-between">
                <p className="font-semibold text-gray-800 text-base">
                  Kartu Tanda Penduduk (KTP)
                </p>
                <Button
                  onClick={() => setOpenKtp(true)}
                  variant="outline"
                  className="text-[#0B63E5] border-[#0B63E5]/60 hover:bg-[#0B63E5]/10 font-semibold shadow-sm"
                >
                  <Eye className="mr-2 h-4 w-4" /> Lihat KTP
                </Button>
              </div>

              {/* Slip Gaji */}
              <div className="border rounded-xl p-5 shadow-sm bg-gray-50 flex items-center justify-between">
                <p className="font-semibold text-gray-800 text-base">
                  Slip Gaji
                </p>
                <Button
                  onClick={() => setOpenSlip(true)}
                  variant="outline"
                  className="text-[#0B63E5] border-[#0B63E5]/60 hover:bg-[#0B63E5]/10 font-semibold shadow-sm"
                >
                  <Eye className="mr-2 h-4 w-4" /> Lihat Slip Gaji
                </Button>
              </div>
            </div>
            
            {/* Dialogs */}
            <ViewDocumentDialog
              open={openKtp}
              onOpenChange={setOpenKtp}
              title="Kartu Tanda Penduduk"
              imageUrl={customer.ktp || null}
            />
            <ViewDocumentDialog
              open={openSlip}
              onOpenChange={setOpenSlip}
              title="Slip Gaji"
              imageUrl={customer.slip || null}
            />
          </section>
        )}

        {/* Control Panel */}
        <section className="grid lg:grid-cols-2 gap-6 items-start">
          {/* Pengaturan KPR */}
          <div
            className="rounded-2xl bg-white p-5 border max-w-[500px]"
            style={{ borderColor: colors.gray + "33" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Settings2 className="h-9 w-9" color={colors.blue} />
              <h2 className="font-semibold text-black text-base">Pengaturan KPR</h2>
            </div>

            {/* === SLIDER HARGA PROPERTI, DP, JANGKA WAKTU === */}
            <div className="space-y-6 mb-4">
              {/* Harga Properti */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-gray-700 font-medium">Harga Properti</label>
                  <span className="font-semibold text-gray-900">
                    Rp{hargaProperti.toLocaleString("id-ID")}
                  </span>
                </div>
                <input
                  type="range"
                  min={100_000_000}
                  max={5_000_000_000}
                  step={10_000_000}
                  value={hargaProperti}
                  onChange={(e) => setHargaProperti(Number(e.target.value))}
                  className="w-full accent-[#3FD8D4] cursor-pointer"
                />
              </div>

              {/* DP */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-gray-700 font-medium">Uang Muka (DP)</label>
                  <span className="font-semibold text-gray-900">
                    {persenDP}% (
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    }).format(hargaProperti * (persenDP / 100))}
                    )
                  </span>
                </div>
                <input
                  type="range"
                  min={10}
                  max={80}
                  step={5}
                  value={persenDP}
                  onChange={(e) => setPersenDP(Number(e.target.value))}
                  className="w-full accent-[#3FD8D4] cursor-pointer"
                />
              </div>
            </div>

            {/* === PENYESUAIAN MULTI-RATE BARU === */}
            <div
              className="mb-4 border rounded-lg p-3"
              style={{ borderColor: colors.gray + "33" }}
            >
              <p className="text-sm font-medium mb-3 text-gray-700">Penyesuaian Bunga Otomatis</p>

              {/* Pilihan Developer */}
              <div className="mb-3">
                <label className="text-xs font-medium text-gray-600">Pilih Tipe Developer</label>
                <select
                  className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-white"
                  value={developerType}
                  onChange={(e) => setDeveloperType(e.target.value as "A" | "B")}
                >
                  <option value="A">🏠 Top Selected Developer</option>
                  <option value="B">🏗️ Developer Kerjasama</option>
                </select>
              </div>

              {/* Pilihan Jenis Bunga */}
              <div className="mb-3">
                <label className="text-xs font-medium text-gray-600">Jenis Skema Bunga</label>
                <select
                  className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-white"
                  value={schemeType}
                  onChange={(e) => setSchemeType(e.target.value as "single_fixed" | "tiered")}
                >
                  <option value="single_fixed">🔒 Single Fixed</option>
                  <option value="tiered">🪜 Tiered Rate</option>
                </select>
              </div>

              {/* TENOR */}
              <div className="mb-3">
                <label className="text-xs font-medium text-gray-600">Pilih Tenor (tahun)</label>
                <select
                  className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-white"
                  value={jangkaWaktu}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    setJangkaWaktu(val)
                    const data = rateData[schemeType]?.[developerType]?.[String(val)]
                    if (data) setSelectedRates(data)
                    else {
                      setSelectedRates({})
                      setRateSegments([])
                    }
                  }}
                >
                  <option value="">-- Pilih Tenor --</option>
                  {Object.keys(rateData[schemeType]?.[developerType] || {}).map((key) => (
                    <option key={key} value={key}>
                      {key} tahun
                    </option>
                  ))}
                </select>
              </div>

              {/* Pilihan Segmen Bunga (khusus single_fixed saja) */}
              {schemeType === "single_fixed" && Object.keys(selectedRates).length > 0 && (
                <div className="mb-3">
                  <label className="text-xs font-medium text-gray-600">Pilih Segmen Bunga</label>
                  <select
                    className="w-full mt-1 border rounded-lg px-3 py-2 text-sm bg-white"
                    onChange={(e) => {
                      const label = e.target.value
                      const rate = selectedRates[label]
                      if (rate) {
                        const match = label.match(/(\d+)/)
                        const years = match ? parseInt(match[1]) : 0
                        const end = years * 12
                        const totalMonths = jangkaWaktu * 12
                        const segments: RateSegment[] = [
                          { start: 1, end, rate, label },
                        ]

                        if (end < totalMonths) {
                          segments.push({
                            start: end + 1,
                            end: totalMonths,
                            rate: 0,
                            label: "Bunga Floating",
                          })
                        }
                        setRateSegments(segments)
                      }
                    }}
                  >
                    <option value="">-- Pilih Segmen --</option>
                    {Object.entries(selectedRates).map(([label, value]) => (
                      <option key={label} value={label}>
                        {label} ({value}%)
                      </option>
                    ))}
                  </select>
                </div>
              )}



              {/* Preview bunga terpilih */}
              <div className="mt-4 bg-gray-50 border rounded-lg p-3 text-sm space-y-1">
                <p className="font-medium text-gray-800">Bunga Berlaku:</p>
                {Object.entries(selectedRates).map(([label, value]) => (
                  <div key={label} className="flex justify-between border-b last:border-none pb-1">
                    <span className="text-gray-600">{label}</span>
                    <span className="font-semibold text-gray-900">{value}%</span>
                  </div>
                ))}
              </div>
            </div>
          <AssignApprovalDialog />


          </div>


          {/* Rincian Angsuran */}
          <div className="rounded-2xl bg-white p-5 border -ml-30" style={{ borderColor: colors.gray + "33" }}>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-9 w-9" color={colors.blue} />
                <h2 className="font-semibold text-black text-base">Rincian Angsuran</h2>
              </div>
            </div>
            <div className="overflow-x-auto border rounded-lg" style={{ borderColor: colors.gray + "33" }}>
              <table className="min-w-full text-sm">
                <thead style={{ background: colors.blue + "11", color: colors.gray }}>
                  <tr>
                    <th className="px-4 py-2">Bulan</th>
                    <th className="px-4 py-2">Pokok</th>
                    <th className="px-4 py-2">Bunga</th>
                    <th className="px-4 py-2">Angsuran</th>
                    <th className="px-4 py-2">Sisa</th>
                    <th className="px-4 py-2">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.map((r) => (
                    <tr key={r.month} className="border-t" style={{ borderColor: colors.gray + "33" }}>
                      <td className="px-4 py-2">{r.month}</td>

                      {r.rateApplied === 0 ? (
                        <>
                          <td className="px-4 py-2 italic text-gray-400">-</td>
                          <td className="px-4 py-2 italic text-gray-400">-</td>
                          <td className="px-4 py-2 italic text-gray-400">-</td>
                          <td className="px-4 py-2 italic text-gray-400">-</td>
                          <td className="px-4 py-2 font-medium text-[#FF8500]">Bunga Floating</td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2">Rp{roundIDR(r.principalComponent).toLocaleString("id-ID")}</td>
                          <td className="px-4 py-2">Rp{roundIDR(r.interestComponent).toLocaleString("id-ID")}</td>
                          <td className="px-4 py-2 font-medium text-black">
                            Rp{roundIDR(r.payment).toLocaleString("id-ID")}
                          </td>
                          <td className="px-4 py-2">Rp{roundIDR(r.balance).toLocaleString("id-ID")}</td>
                          <td className="px-4 py-2">{r.rateApplied.toFixed(2)}%</td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            <div className="flex justify-between items-center mt-4 text-sm">
              <span>Halaman {page} / {maxPage}</span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1 rounded border disabled:opacity-40"
                  style={{ borderColor: colors.blue, color: colors.blue }}
                >
                  Prev
                </button>
                <button
                  disabled={page === maxPage}
                  onClick={() => setPage((p) => Math.min(maxPage, p + 1))}
                  className="px-3 py-1 rounded border disabled:opacity-40"
                  style={{ borderColor: colors.blue, color: colors.blue }}
                >
                  Next
                </button>
              </div>
            </div>
          </div>

        </section>

        <section className="grid lg:grid-cols-3 gap-6">


          {/* Chart */}
          {/* <div className="lg:col-span-2 rounded-2xl bg-white p-5 border" style={{ borderColor: colors.gray + "33" }}>
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold text-black text-base">Grafik Angsuran</h2>
              <button
                className="flex items-center gap-2 border rounded-lg px-3 py-2 text-sm"
                style={{ borderColor: colors.gray + "55", color: colors.gray }}
              >
                <FileDown className="h-4 w-4" /> Export
              </button>
            </div>
            <div className="h-60">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={colors.gray + "55"} />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke={colors.gray} />
                  <YAxis tick={{ fontSize: 12 }} stroke={colors.gray} />
                  <Tooltip formatter={(v: number | string) => `Rp${Number(v).toLocaleString("id-ID")}`} />
                  <Line type="monotone" dataKey="payment" stroke={colors.blue} strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div> */}
        </section>


        {/* Actions */}
        <section className="flex flex-wrap gap-3 justify-end">


          <button
            onClick={() => router.push('/confirm?action=reject')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-medium text-white shadow hover:bg-red-600 transition-colors"
            style={{ background: '#dc2626' }}
          >
            <X className="h-5 w-5" /> Reject
          </button>
          <button
            onClick={() => router.push('/confirm?action=approve')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl font-medium text-white shadow hover:bg-green-600 transition-colors"
            style={{ background: '#16a34a' }}
          >
            <Check className="h-5 w-5" /> Approve
          </button>
        </section>

      </main>
    </div>
  );
}

export const dynamic = "force-dynamic"
export const fetchCache = "force-no-store"