// src/services/customer.ts
import coreApi from "@/lib/coreApi"
import { apiToUi, uiToApi } from "@/lib/customer-mapper"

export type Customer = {
  id: string

  // --- Data Profil ---
  name: string
  username: string
  email: string
  phone: string
  nik: string
  npwp: string
  birth_date: string
  birth_place: string
  gender: string
  marital_status: string
  address: string
  sub_district: string
  district: string
  city: string
  province: string
  postal_code: string
  ktp: string
  slip: string
  credit_score: 1 | 2 | 3 | 4 | 5
  credit_status: "Lancar" | "Dalam Perhatian Khusus" | "Kurang Lancar" | "Diragukan" | "Macet"

  // --- Data Pekerjaan ---
  occupation: string
  company_postal_code: string
  company_name: string
  company_address: string
  company_district: string
  company_subdistrict: string
  company_city: string
  company_province: string
  monthly_income: string
}

export async function getAllUsers() {
  try {
    const res = await coreApi.get("/admin/users", {
    })

    console.log("➡️ STATUS:", res.status)
    console.log("📦 HASIL API:", res.data)
    // Beberapa endpoint mengembalikan bentuk berbeda:
    // { data: { data: [] } } atau { data: [] }
    const payload = res.data
    const list = payload?.data?.data ?? payload?.data ?? []
    return Array.isArray(list) ? list : []
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

export async function getCustomerById(id: string | number) {
  try {
    const res = await coreApi.get(`/admin/users/${id}`)
    const raw = res.data?.data
    return raw ? apiToUi(raw) : null
  } catch (error) {
    console.error("❌ Error getCustomerById:", error)
    return null
  }
}

// 🔹 Update customer (PUT /admin/users/{id})
export async function updateCustomer(id: string | number, ui: Customer) {
  try {
    const payload = uiToApi(ui)
    const res = await coreApi.put(`/admin/users/${id}`, payload)
    const raw = res.data?.data
    // Kembalikan versi UI agar langsung dipakai kembali di komponen
    return raw ? apiToUi(raw) : null
  } catch (error: any) {
    if (error.response) {
      console.error("❌ Error updateCustomer:", error.response.data)
    } else {
      console.error("❌ Error updateCustomer:", error)
    }
    return null
  }
}

