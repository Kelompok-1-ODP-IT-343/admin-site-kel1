// src/services/akun.ts
import coreApi from "@/lib/coreApi"

export async function getUserProfile() {
  try {
    const res = await coreApi.get("/user/profile")

    // axios otomatis parse JSON, jadi langsung ambil data
    return res.data?.data || null
  } catch (err: any) {
    // Jika backend balikin error message
    if (err.response) {
      console.error("❌ Backend response:", err.response.data)
    } else {
      console.error("❌ getUserProfile error:", err)
    }
    return null
  }
}

export async function updateUserProfile(id: number | string, payload: { fullName?: string; username?: string; phone?: string }) {
  try {
    const res = await coreApi.put(`/user/${id}`, payload)
    return res?.data?.data ?? res?.data ?? null
  } catch (err: any) {
    if (err?.response) {
      console.error("❌ Backend response:", err.response.data)
    } else {
      console.error("❌ updateUserProfile error:", err)
    }
    throw err
  }
}
