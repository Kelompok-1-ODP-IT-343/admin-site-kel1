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
