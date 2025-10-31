// src/services/developers.ts
import coreApi from "@/lib/coreApi"

// 🔹 Ambil semua developer (dengan pagination opsional)
export async function fetchDevelopers() {
  try {
    const res = await coreApi.get(`/admin/developers?page=0&size=10`)
    console.log("✅ Hasil API:", res.data)
    return res.data?.data?.data ?? []
  } catch (error: any) {
    console.error("🚨 Error fetch developers:", error)

    if (error.response) {
      console.error("📡 Status:", error.response.status)
      console.error("📦 Raw data:", error.response.data)
      console.error("🧾 Headers:", error.response.headers)
    } else {
      console.error("❌ Tidak ada response dari server:", error.message)
    }
    return []
  }
}

// 🔹 Ambil developer berdasarkan ID
export async function getDeveloperById(id: string | number) {
  try {
    const res = await coreApi.get(`/admin/developers/${id}`, {
    })
    return res.data // { success, data: {...} }
  } catch (error) {
    console.error(`❌ GET /developers/${id} gagal:`, error)
    throw error
  }
}

// 🔹 Update data developer (edit detail)
export async function updateDeveloper(id: string | number, payload: any) {
  try {
    const res = await coreApi.put(`/admin/developers/${id}`, payload)
    return res.data // { success, data: {...} }
  } catch (error) {
    console.error(`❌ PUT /developers/${id} gagal:`, error)
    throw error
  }
}

// 🔹 Update status developer (ACTIVE / INACTIVE)
export async function updateDeveloperStatus(id: string, status: "ACTIVE" | "INACTIVE") {
  try {
    const res = await coreApi.put(`/admin/developers/${id}`, { status })
    console.log(`✅ Developer ${id} diupdate ke status: ${status}`)
    return res.data
  } catch (error) {
    console.error(`❌ Gagal update status developer ${id}:`, error)
    throw error
  }
}
