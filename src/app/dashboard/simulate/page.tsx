"use client";

import React, { JSX, useMemo, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { Check, X, Calculator, FileDown, Settings2, Info, XCircle, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

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
};

// ----- Component -----
export default function ApprovalDetailMockup(): JSX.Element {
  const router = useRouter();

  const [loanAmount, setLoanAmount] = useState<number>(850_000_000);
  const [tenor, setTenor] = useState<number>(240);
  const [startFloatAt, setStartFloatAt] = useState<number>(13);
  const [flatRate, setFlatRate] = useState<number>(5.99);
  const [floatRate, setFloatRate] = useState<number>(13.5);
  const [scheme, setScheme] = useState<Scheme>("flat-floating");
  const [page, setPage] = useState<number>(1);
  const pageSize = 12;

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
  function buildFlatSchedule(P: number, months: number, rateAnnual: number): Row[] {
    const rMonthly = rateAnnual / 100 / 12;
    const principalPart = P / months;
    const interestPart = P * rMonthly;
    let balance = P;
    const rows: Row[] = [];
    for (let m = 1; m <= months; m++) {
      const principalPaid = m === months ? balance : principalPart;
      const interestPaid = interestPart;
      const payment = principalPaid + interestPaid;
      balance = Math.max(0, balance - principalPaid);
      rows.push({
        month: m,
        principalComponent: principalPaid,
        interestComponent: interestPaid,
        payment,
        balance,
        rateApplied: rateAnnual,
      });
    }
    return rows;
  }

  function buildAnnuitySchedule(
    P: number,
    months: number,
    rateAnnual: number,
    startMonthIndex: number = 1
  ): Row[] {
    const r = rateAnnual / 100 / 12;
    if (months <= 0) return [];
    const pay = r === 0 ? P / months : (P * r) / (1 - Math.pow(1 + r, -months));
    const rows: Row[] = [];
    let balance = P;
    for (let i = 1; i <= months; i++) {
      const interest = balance * r;
      const principal = Math.min(balance, pay - interest);
      balance = Math.max(0, balance - principal);
      rows.push({
        month: startMonthIndex + i - 1,
        principalComponent: principal,
        interestComponent: interest,
        payment: principal + interest,
        balance,
        rateApplied: rateAnnual,
      });
    }
    return rows;
  }

  // fungsi baru: bangun jadwal berdasarkan segmen rate
  function buildMultiSegmentSchedule(): Row[] {
    let balance = loanAmount;
    const all: Row[] = [];

    rateSegments.forEach((seg) => {
      const months = seg.end - seg.start + 1;
      const segRows = buildAnnuitySchedule(balance, months, seg.rate, seg.start);
      balance = segRows[segRows.length - 1]?.balance ?? balance;
      all.push(...segRows);
    });

    return all;
  }

  function buildHybridSchedule(): Row[] {
    // kalau pakai fitur multi-rate, override
    if (rateSegments.length > 1) {
      return buildMultiSegmentSchedule();
    }

    if (scheme === "all-flat") return buildFlatSchedule(loanAmount, tenor, flatRate);
    if (scheme === "all-float") return buildAnnuitySchedule(loanAmount, tenor, floatRate, 1);

    const flatMonths = Math.max(1, Math.min(startFloatAt - 1, tenor - 1));
    const flatRows = buildFlatSchedule(loanAmount, flatMonths, flatRate);
    const balanceAfterFlat = flatRows[flatRows.length - 1]?.balance ?? loanAmount;
    const remaining = tenor - flatMonths;
    const floatRows = buildAnnuitySchedule(balanceAfterFlat, remaining, floatRate, flatMonths + 1);
    return [...flatRows, ...floatRows];
  }

  const rows: Row[] = useMemo<Row[]>(() => buildHybridSchedule(), [
    loanAmount, tenor, startFloatAt, flatRate, floatRate, scheme, rateSegments,
  ]);

  const totalPayment = useMemo(() => rows.reduce((s, r) => s + r.payment, 0), [rows]);
  const totalInterest = useMemo(() => rows.reduce((s, r) => s + r.interestComponent, 0), [rows]);
  const paged = rows.slice((page - 1) * pageSize, page * pageSize);
  const maxPage = Math.ceil(rows.length / pageSize);

  const chartData = rows.map((r) => ({
    month: r.month,
    payment: Math.round(r.payment),
  }));

  return (
    <div className="min-h-screen bg-white text-gray-700 relative">
      {/* Header */}
      <header
        className="sticky top-0 z-10 border-b bg-white"
        style={{ borderColor: colors.blue }}
      >
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4 relative">
          <div className="flex items-center gap-3">
            <div
              style={{ background: colors.blue }}
              className="h-9 w-9 rounded-xl text-white grid place-content-center font-bold"
            >
              SA
            </div>
            <div>
              <h1 className="font-semibold text-lg text-black">
                Approval – Detail Pengajuan
              </h1>
              <p className="text-xs">Satu Atap Admin • Simulasi Suku Bunga</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Info className="h-4 w-4" color={colors.blue} />
            <span>Audit trail aktif</span>
          </div>

          {/* Tombol Close di pojok kanan atas */}
          <button
            onClick={() => router.push("/dashboard")}
            className="absolute right-6 top-4 flex items-center gap-1 text-sm text-gray-600 hover:text-red-500 transition"
          >
            <XCircle className="h-5 w-5" /> Close
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 py-6 space-y-6">
        {/* Summary Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl shadow-sm border" style={{ borderColor: colors.gray + "33" }}>
            <p className="text-xs uppercase">Nasabah</p>
            <h3 className="font-semibold text-black mt-1 text-lg">Baharuddin</h3>
            <p>ID Pengajuan #A-2025-00123</p>
          </div>
          <div className="p-5 rounded-2xl shadow-sm border" style={{ borderColor: colors.gray + "33" }}>
            <p className="text-xs uppercase">Plafon</p>
            <h3 className="font-semibold text-black mt-1 text-lg">Rp{loanAmount.toLocaleString("id-ID")}</h3>
            <p>Tenor {tenor} bulan</p>
          </div>
          <div className="p-5 rounded-2xl shadow-sm border" style={{ borderColor: colors.gray + "33" }}>
            <p className="text-xs uppercase">Ringkasan Simulasi</p>
            <p>Total Bunga: <span className="font-semibold text-black">Rp{roundIDR(totalInterest).toLocaleString("id-ID")}</span></p>
            <p>Total Pembayaran: <span className="font-semibold text-black">Rp{roundIDR(totalPayment).toLocaleString("id-ID")}</span></p>
          </div>
        </section>

        {/* Control Panel */}
        <section className="grid lg:grid-cols-3 gap-6">
          <div className="rounded-2xl bg-white p-5 border" style={{ borderColor: colors.gray + "33" }}>
            <div className="flex items-center gap-2 mb-3">
              <Settings2 className="h-5 w-5" color={colors.blue} />
              <h2 className="font-semibold text-black text-base">Pengaturan Bunga</h2>
            </div>

            {/* --- tambahan: multi-rate adjustment UI --- */}
            <div className="mb-4 border rounded-lg p-3" style={{ borderColor: colors.gray + "33" }}>
              <p className="text-sm font-medium mb-2">Penyesuaian Multi-Rate</p>
              {rateSegments.map((seg, idx) => (
                <div key={idx} className="grid grid-cols-4 gap-2 mb-2 items-end">
                  <label className="text-xs">
                    Mulai
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1 mt-1"
                      value={seg.start}
                      onChange={(e) => {
                        const arr = [...rateSegments];
                        arr[idx].start = parseInt(e.target.value);
                        setRateSegments(arr);
                      }}
                    />
                  </label>
                  <label className="text-xs">
                    Selesai
                    <input
                      type="number"
                      className="w-full border rounded px-2 py-1 mt-1"
                      value={seg.end}
                      onChange={(e) => {
                        const arr = [...rateSegments];
                        arr[idx].end = parseInt(e.target.value);
                        setRateSegments(arr);
                      }}
                    />
                  </label>
                  <label className="text-xs">
                    Rate (%)
                    <input
                      type="number"
                      step="0.01"
                      className="w-full border rounded px-2 py-1 mt-1"
                      value={seg.rate}
                      onChange={(e) => {
                        const arr = [...rateSegments];
                        arr[idx].rate = parseFloat(e.target.value);
                        setRateSegments(arr);
                      }}
                    />
                  </label>
                  <button
                    onClick={() => setRateSegments(rateSegments.filter((_, i) => i !== idx))}
                    className="text-red-500 hover:text-red-600 flex items-center gap-1 justify-center"
                  >
                    <Trash2 className="h-4 w-4" /> Hapus
                  </button>
                </div>
              ))}
              <button
                onClick={() =>
                  setRateSegments([...rateSegments, { start: tenor - 11, end: tenor, rate: floatRate }])
                }
                className="mt-2 flex items-center gap-2 text-sm border rounded-lg px-3 py-1"
                style={{ borderColor: colors.blue, color: colors.blue }}
              >
                <Plus className="h-4 w-4" /> Tambah Segmen
              </button>
            </div>
            {/* --- end multi-rate UI --- */}

            <div className="grid grid-cols-3 gap-2 mb-4">
              {(["flat-floating", "all-flat", "all-float"] as Scheme[]).map((opt) => (
                <button
                  key={opt}
                  onClick={() => setScheme(opt)}
                  style={{
                    background: scheme === opt ? colors.blue : "transparent",
                    color: scheme === opt ? "white" : colors.gray,
                    border: `1px solid ${colors.gray}40`,
                  }}
                  className="rounded-lg px-3 py-2 text-sm font-medium transition"
                >
                  {opt === "flat-floating" ? "Flat → Float" : opt === "all-flat" ? "Flat" : "Float"}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <label>
                <span>Plafon (Rp)</span>
                <input
                  type="number"
                  className="w-full rounded-lg border px-3 py-2"
                  style={{ borderColor: colors.gray + "55" }}
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(parseInt(e.target.value || "0", 10))}
                />
              </label>
              <label>
                <span>Tenor (bulan)</span>
                <input
                  type="number"
                  className="w-full rounded-lg border px-3 py-2"
                  style={{ borderColor: colors.gray + "55" }}
                  value={tenor}
                  onChange={(e) => setTenor(parseInt(e.target.value || "0", 10))}
                />
              </label>
              <label>
                <span>Rate Flat (% p.a.)</span>
                <input
                  type="number"
                  step="0.01"
                  className="w-full rounded-lg border px-3 py-2"
                  style={{ borderColor: colors.gray + "55" }}
                  value={flatRate}
                  onChange={(e) => setFlatRate(parseFloat(e.target.value || "0"))}
                />
              </label>
              <label>
                <span>Rate Floating (% p.a.)</span>
                <input
                  type="number"
                  step="0.01"
                  className="w-full rounded-lg border px-3 py-2"
                  style={{ borderColor: colors.gray + "55" }}
                  value={floatRate}
                  onChange={(e) => setFloatRate(parseFloat(e.target.value || "0"))}
                />
              </label>
              {scheme === "flat-floating" && (
                <label className="col-span-2">
                  <span>Mulai Floating di bulan ke-</span>
                  <input
                    type="number"
                    className="w-full rounded-lg border px-3 py-2"
                    style={{ borderColor: colors.gray + "55" }}
                    value={startFloatAt}
                    onChange={(e) => setStartFloatAt(parseInt(e.target.value || "2", 10))}
                  />
                </label>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white"
                style={{ background: colors.blue }}
              >
                <Calculator className="h-4 w-4" /> Recalculate
              </button>
              <button
                className="border rounded-lg px-4 py-2"
                style={{ borderColor: colors.blue, color: colors.blue }}
              >
                Simpan
              </button>
            </div>

            <p
              className="mt-3 text-xs p-3 rounded-lg"
              style={{ background: colors.orange + "22", color: colors.orange }}
            >
              Flat: bunga dari pokok awal. Floating: annuity pada sisa pokok (re-amortisasi).
            </p>
          </div>

          {/* Chart */}
          <div className="lg:col-span-2 rounded-2xl bg-white p-5 border" style={{ borderColor: colors.gray + "33" }}>
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
          </div>
        </section>

        {/* Table */}
        <section className="rounded-2xl bg-white p-5 border" style={{ borderColor: colors.gray + "33" }}>
          <div className="flex justify-between mb-3">
            <h2 className="font-semibold text-black text-base">Rincian Angsuran</h2>
            <p className="text-sm">Total baris: {rows.length}</p>
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
                    <td className="px-4 py-2">Rp{roundIDR(r.principalComponent).toLocaleString("id-ID")}</td>
                    <td className="px-4 py-2">Rp{roundIDR(r.interestComponent).toLocaleString("id-ID")}</td>
                    <td className="px-4 py-2 font-medium text-black">Rp{roundIDR(r.payment).toLocaleString("id-ID")}</td>
                    <td className="px-4 py-2">Rp{roundIDR(r.balance).toLocaleString("id-ID")}</td>
                    <td className="px-4 py-2">{r.rateApplied.toFixed(2)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
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
        </section>

        {/* Actions */}
        <section className="flex flex-wrap gap-3">
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
