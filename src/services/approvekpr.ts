// services/approvekpr.ts
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

export async function getAllPengajuanByUser() {
  try {
    // 🔹 Ambil token admin dari cookie
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]

    if (!token) throw new Error("Token tidak ditemukan di cookie")

    // const res = await fetch("http://localhost:18080/api/v1/kpr-applications/admin/all", {
    const res = await fetch("http://local-dev.satuatap.my.id/api/v1/kpr-applications/admin/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }

    const json = await res.json()
    // 🔹 Filter hanya yang status === "SUBMITTED"
    const data: Pengajuan[] = json.data?.filter((item: Pengajuan) => item.status === "SUBMITTED") || []

    return data
  } catch (error) {
    console.error("❌ Error fetching pengajuan:", error)
    return []
  }
}

export async function getAllNonSubmittedPengajuan() {
  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]

    if (!token) throw new Error("Token tidak ditemukan di cookie")

    const res = await fetch("http://local-dev.satuatap.my.id/api/v1/kpr-applications/admin/all", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

    const json = await res.json()
    // 🔹 Ambil semua kecuali SUBMITTED
    const data: Pengajuan[] = json.data?.filter(
      (item: Pengajuan) => item.status !== "SUBMITTED"
    ) || []

    return data
  } catch (error) {
    console.error("❌ Error fetching pengajuan (non-submitted):", error)
    return []
  }
}
