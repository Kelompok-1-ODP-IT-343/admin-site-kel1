"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Customer, getCustomerById, updateCustomer } from "@/services/customers";
import { getCreditScore } from "@/services/creditScore";
import { useEffect, useState } from "react";
import { toast } from "sonner"

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
const nonEditableFields = [
  // Profil (tidak bisa diubah)
  "nik", // 🧱 data identitas, backend tidak izinkan update
  "npwp", // 🧱 data pajak, backend tidak izinkan update
  "sub_district",
  "district",
  "ktp",
  "slip",
  "credit_score",
  "credit_status",

  // Perusahaan (tidak ada di backend)
  "company_postal_code",
  "company_address",
  "company_district",
  "company_subdistrict",
  "company_city",
  "company_province",
];


export default function ViewCustomerDialog({
  open,
  onOpenChange,
  customer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}) {
  const defaultCustomer: Customer = {
    id: "",
    name: "",
    username: "",
    email: "",
    phone: "",
    nik: "",
    npwp: "",
    birth_date: "",
    birth_place: "",
    gender: "",
    marital_status: "",
    address: "",
    sub_district: "",
    district: "",
    city: "",
    province: "",
    postal_code: "",
    ktp: "",
    slip: "",
    credit_score: 3,
    credit_status: "Lancar",
    occupation: "",
    company_postal_code: "",
    company_name: "",
    company_address: "",
    company_district: "",
    company_subdistrict: "",
    company_city: "",
    company_province: "",
    monthly_income: "",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({ ...(customer ?? defaultCustomer) });
  const [loading, setLoading] = useState(false);
  const [creditScore, setCreditScore] = useState<number | null>(null);
  const [creditLoading, setCreditLoading] = useState(false);
  const [creditError, setCreditError] = useState<string | null>(null);

  // Saat dialog dibuka, ambil detail terbaru dari API menggunakan id
  useEffect(() => {
    let cancelled = false;
    async function fetchLatest() {
      if (!open || !customer?.id) return;
      try {
        setLoading(true);
        const fresh = await getCustomerById(customer.id);
        if (!cancelled && fresh) {
          setEditedData({ ...fresh });
        }
      } catch (err) {
        console.error("❌ Gagal mengambil detail customer:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchLatest();
    return () => {
      cancelled = true;
    };
  }, [open, customer?.id]);

  useEffect(() => {
    async function fetchScore() {
      if (!open || !customer?.id) return;
      setCreditLoading(true);
      setCreditError(null);
      try {
        const res = await getCreditScore(customer.id);
        if (res && typeof res.score === "number") {
          setCreditScore(Math.round(res.score));
        } else {
          setCreditScore(null);
          setCreditError("Score tidak tersedia");
        }
      } catch {
        setCreditScore(null);
        setCreditError("Score tidak tersedia");
      } finally {
        setCreditLoading(false);
      }
    }
    fetchScore();
  }, [open, customer?.id]);

  const handleChange = (field: string, value: string) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!customer?.id) return;
    try {
      setLoading(true);
      toast.loading("Menyimpan perubahan...", { id: "save-customer" }); // ⏳ loading

      const updated = await updateCustomer(customer.id, editedData);

      if (updated) {
        setEditedData({ ...updated });
        setIsEditing(false);
        toast.success("Data nasabah berhasil disimpan", { id: "save-customer" }); // ✅ sukses
      } else {
        toast.error("❌ Gagal memperbarui data nasabah", { id: "save-customer" }); // ❌ gagal logic
      }
    } catch (err) {
      console.error("❌ Error saat menyimpan perubahan:", err);
      toast.error("Terjadi kesalahan saat menyimpan data.", { id: "save-customer" }); // ❌ error try-catch
    } finally {
      setLoading(false);
    }
  };

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
    if (x === undefined || x === null || x === "") return "-";
    const n = typeof x === "string" ? parseInt(x, 10) : x;
    if (!Number.isFinite(n as number)) return "-";
    return `${n} Tahun`;
  }
  function formatCurrencyID(x?: string | number): string {
    if (x === undefined || x === null || x === "") return "-";
    const n = typeof x === "string" ? Number(x) : x;
    if (!Number.isFinite(n as number)) return "-";
    return `Rp ${Number(n).toLocaleString("id-ID")}`;
  }

  function scoreColor(score: number): string {
    if (score <= 560) return "#EF4444";
    if (score <= 650) return "#F97316";
    if (score <= 700) return "#EAB308";
    if (score <= 750) return "#3B82F6";
    return "#22C55E";
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[950px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left space-y-0">
          <DialogTitle className="text-lg font-semibold leading-tight mb-2 text-gray-900 dark:!text-white flex justify-between items-center">
            Customer Information

          </DialogTitle>
        </DialogHeader>

        {/* === GRID 2 KOLOM === */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* ---------- KIRI: DATA PROFIL ---------- */}
          <div className="border rounded-xl p-4 bg-card shadow-sm">
            <h3 className="font-semibold text-base mb-3 text-gray-900 dark:!text-white">
              Data Profil
            </h3>
            <div className="space-y-2 text-sm">
              {/* Nama, username, email, telepon, NIK, NPWP */}
              {[
                ["Nama Lengkap", "name"],
                ["Username", "username"],
                ["Email", "email"],
                ["Telepon", "phone"],
                ["NIK", "nik"],
                ["NPWP", "npwp"],
              ].map(([label, key]) => (
                <div key={key} className="flex justify-between border-b pb-1 items-center">
                  <span className="text-muted-foreground">{label}</span>
                  {isEditing ? (
                    <Input
                      value={(editedData as any)[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-[55%] h-7 text-sm"
                      disabled={nonEditableFields.includes(key)}
                    />
                  ) : (
                    <span className="font-medium text-right w-[55%] text-right">
                      {(editedData as any)[key]}
                    </span>
                  )}
                </div>
              ))}

              {/*TEMPAT DAN TANGGAL LAHIR */}
              <div className="flex justify-between border-b pb-1 items-center">
                <span className="text-muted-foreground">Tempat dan Tgl Lahir</span>
                {isEditing ? (
                  <div className="flex gap-2 w-[55%] justify-end">
                    <Input
                      value={editedData.birth_place}
                      onChange={(e) => handleChange("birth_place", e.target.value)}
                      className="h-7 text-sm w-[50%]"
                    />
                    <Input
                      value={editedData.birth_date}
                      onChange={(e) => handleChange("birth_date", e.target.value)}
                      className="h-7 text-sm w-[50%]"
                      
                    />
                  </div>
                ) : (
                  <span className="font-medium text-right w-[55%] text-right">
                    {formatTitle(editedData.birth_place)}, {formatDateIndo(editedData.birth_date)}
                  </span>
                )}
              </div>

              {/* jENIS KELAMIN & STATUS */}
              {[
                ["Jenis Kelamin", "gender"],
                ["Status", "marital_status"],
              ].map(([label, key]) => (
                <div key={key} className="flex justify-between border-b pb-1 items-center">
                  <span className="text-muted-foreground">{label}</span>
                  {isEditing ? (
                    <Input
                      value={(editedData as any)[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-[55%] h-7 text-sm"
                      disabled={nonEditableFields.includes(key)}
                    />
                  ) : (
                    <span className="font-medium text-right w-[55%] text-right">
                      {key === "gender"
                        ? formatGender((editedData as any)[key])
                        : formatTitle((editedData as any)[key])}
                    </span>
                  )}
                </div>
              ))}

              {/*ALAMAT LENGKAP */}
              <div className="flex justify-between border-b pb-1 items-center">
                <span className="text-muted-foreground">Alamat</span>
                {isEditing ? (
                  <Input
                    value={`${editedData.address}, ${editedData.city}`}
                    onChange={(e) => handleChange("address", e.target.value)}
                    className="w-[55%] h-7 text-sm"
                  />
                ) : (
                  <span className="font-medium text-right w-[55%] text-right">
                    {editedData.address || "-"}, {formatTitle(editedData.city)}
                  </span>
                )}
              </div>

              {/* Provinsi & Kode Pos */}
              {[
                ["Provinsi", "province"],
                ["Kode Pos", "postal_code"],
              ].map(([label, key]) => (
                <div key={key} className="flex justify-between border-b pb-1 items-center">
                  <span className="text-muted-foreground">{label}</span>
                  {isEditing ? (
                    <Input
                      value={(editedData as any)[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-[55%] h-7 text-sm"
                      disabled={nonEditableFields.includes(key)}
                    />
                  ) : (
                    <span className="font-medium text-right w-[55%] text-right">
                      {key === "province" ? formatTitle((editedData as any)[key]) : ((editedData as any)[key] || "-")}
                    </span>
                  )}
                </div>
              ))}

              {/* Credit Score */}
              <div className="flex justify-between pt-2 mt-2 items-center">
                <span className="text-muted-foreground">Credit Score</span>
                {creditLoading ? (
                  <span className="text-xs text-muted-foreground">Mengambil credit score...</span>
                ) : creditScore !== null ? (
                  <span
                    className="font-medium text-xs px-2 py-0.5 rounded-full border"
                    style={{ color: scoreColor(creditScore), borderColor: scoreColor(creditScore) }}
                  >
                    Skor {creditScore}
                  </span>
                ) : (
                  <span className="font-medium text-xs px-2 py-0.5 rounded-full border text-gray-500 border-gray-300">
                    Skor tidak tersedia
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ---------- KANAN: DATA PEKERJAAN ---------- */}
          <div className="border rounded-xl p-4 bg-card shadow-sm">
            <h3 className="font-semibold text-base mb-3 text-gray-900 dark:!text-white">
              Data Pekerjaan
            </h3>
            <div className="space-y-2 text-sm">
              {[
                ["Pekerjaan", "occupation"],
                ["Pendapatan Bulanan", "monthly_income"],
                ["Nama Perusahaan", "company_name"],
              ].map(([label, key]) => (
                <div key={key} className="flex justify-between border-b pb-1 items-center">
                  <span className="text-muted-foreground">{label}</span>
                  {isEditing ? (
                    <Input
                      value={(editedData as any)[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-[55%] h-7 text-sm"
                      disabled={nonEditableFields.includes(key)}
                    />
                    ) : (
                      <span className="font-medium text-right w-[55%] text-right">
                        {key === "occupation"
                          ? formatOccupation((editedData as any)[key])
                          : key === "monthly_income"
                          ? formatCurrencyID((editedData as any)[key])
                          : ((editedData as any)[key] || "-")}
                      </span>
                    )}
                  </div>
                ))}

              {/*ALAMAT PERUSAHAAN */}
              <div className="flex justify-between border-b pb-1 items-center">
                <span className="text-muted-foreground">Alamat Perusahaan</span>
                {isEditing ? (
                  <Input
                    value={`${editedData.company_address}, ${editedData.company_subdistrict}, ${editedData.company_district}`}
                    onChange={(e) => handleChange("company_address", e.target.value)}
                    className="w-[55%] h-7 text-sm"
                  />
                ) : (
                  <span className="font-medium text-right w-[55%] text-right">
                    {editedData.company_address || "-"}, {formatTitle(editedData.company_subdistrict)}, {formatTitle(editedData.company_district)}
                  </span>
                )}
              </div>

              {/* Kota, Provinsi, Kode Pos */}
              {[
                ["Kota", "company_city"],
                ["Provinsi", "company_province"],
                ["Kode Pos", "company_postal_code"],
              ].map(([label, key]) => (
                <div key={key} className="flex justify-between border-b pb-1 items-center">
                  <span className="text-muted-foreground">{label}</span>
                  {isEditing ? (
                    <Input
                      value={(editedData as any)[key]}
                      onChange={(e) => handleChange(key, e.target.value)}
                      className="w-[55%] h-7 text-sm"
                      disabled={nonEditableFields.includes(key)}
                    />
                    ) : (
                      <span className="font-medium text-right w-[55%] text-right">
                        {key === "company_city" || key === "company_province"
                          ? formatTitle((editedData as any)[key])
                          : ((editedData as any)[key] || "-")}
                      </span>
                    )}
                  </div>
                ))}
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Pengalaman Kerja</span>
                  <span className="font-medium text-right w-[55%] text-right">
                    {formatYears((editedData as any).work_experience)}
                  </span>
                </div>
              </div>
            </div>
        </div>

        {/* --- FOOTER --- */}
        <div className="flex justify-end gap-2">
          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          ) : (
            <>
              <Button size="sm" onClick={handleSave} disabled={loading}>
                {loading ? "Saving..." : "Save"}
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          )}
        </div>
        <div className="mt-6 text-xs text-muted-foreground text-center">
          Data nasabah bersifat rahasia dan dilindungi oleh kebijakan privasi BNI.
        </div>
      </DialogContent>
    </Dialog>
  );
}
