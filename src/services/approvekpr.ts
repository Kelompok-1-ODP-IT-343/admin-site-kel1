// src/services/approvekpr.ts
import coreApi from "@/lib/coreApi"

export type Pengajuan = {
  id: number
  applicantName: string
  applicantEmail: string
  applicantPhone: string | null
  aplikasiKode: string
  namaProperti: string
  alamat: string
  harga: number
  tanggal: string
  jenis: string
  status: string
}

// 🔹 Ambil semua pengajuan dengan status SUBMITTED
export async function getAllPengajuanByUser() {
  try {
    const res = await coreApi.get("/kpr-applications/admin/all")

    const json = res.data
    const data: Pengajuan[] =
      json.data?.filter((item: Pengajuan) => item.status === "SUBMITTED") || []

    console.log("📦 Pengajuan SUBMITTED:", data.length)
    return data
  } catch (error) {
    console.error("❌ Error fetching pengajuan (submitted):", error)
    return []
  }
}

// 🔹 Ambil semua pengajuan dengan status selain SUBMITTED
export async function getAllNonSubmittedPengajuan() {
  try {
    const res = await coreApi.get("/kpr-applications/admin/all", {
    })

    const json = res.data
    const data: Pengajuan[] =
      json.data?.filter((item: Pengajuan) => item.status !== "SUBMITTED") || []

    console.log("📦 Pengajuan non-submitted:", data.length)
    return data
  } catch (error) {
    console.error("❌ Error fetching pengajuan (non-submitted):", error)
    return []
  }
}
