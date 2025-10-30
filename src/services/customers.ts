// src/services/customer.ts
import coreApi from "@/lib/coreApi"

export async function getAllUsers() {
  try {
    const res = await coreApi.get("/admin/users", {
      // disable cache di sisi Next.js fetch layer
      headers: { "Cache-Control": "no-store" },
    })

    console.log("➡️ STATUS:", res.status)
    console.log("📦 HASIL API:", res.data)

    return res.data?.data?.data || []
  } catch (error) {
    console.error("❌ Error fetching users:", error)
    return []
  }
}

export async function deleteUser(id: string) {
  try {
    const res = await coreApi.delete(`/admin/users/${id}`)

    if (res.status >= 200 && res.status < 300) {
      console.log(`✅ User ${id} berhasil dihapus`)
      return true
    } else {
      console.error("❌ Gagal menghapus user:", res.status)
      return false
    }
  } catch (error) {
    console.error("❌ Error deleteUser:", error)
    return false
  }
}
