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
  work_experience?: string | number
}

export async function getAllUsers() {
  try {
    const direct = await coreApi.get("/admin/users/all")
    const directPayload = direct.data
    const directList = directPayload?.data?.data ?? directPayload?.data ?? directPayload ?? []
    if (Array.isArray(directList) && directList.length >= 0) {
      return directList
    }
  } catch {
  }

  try {
    const pageSize = 200
    let page = 0
    const acc: unknown[] = []
    while (true) {
      const res = await coreApi.get(`/admin/users?page=${page}&size=${pageSize}`)
      const payload = res.data
      const list = payload?.data?.data ?? payload?.data ?? []
      if (!Array.isArray(list) || list.length === 0) break
      acc.push(...list)
      if (list.length < pageSize) break
      page += 1
      if (page > 1000) break
    }
    const map: Record<string, unknown> = {}
    for (const item of acc) {
      const candidate = item as { id?: string | number; userId?: string | number }
      const key = String((candidate.id ?? candidate.userId) ?? acc.length)
      if (!map[key]) map[key] = item
    }
    return Object.values(map)
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
    const mapped = uiToApi(ui)
    const allow = [
      "fullName",
      "username",
      "email",
      "phone",
      "birthDate",
      "birthPlace",
      "gender",
      "maritalStatus",
      "address",
      "city",
      "province",
      "postalCode",
      "occupation",
      "companyName",
      "monthlyIncome",
      "workExperience",
    ]
    const payload: Record<string, any> = {}
    for (const k of allow) {
      const v = (mapped as any)[k]
      if (v === undefined || v === null) continue
      const t = typeof v === "string" ? v.trim() : v
      if (t === "" || t === "-") continue
      payload[k] = v
    }
    const res = await coreApi.put(`/admin/users/${id}`, payload)
    const updatedRaw = res.data?.data
    // Kembalikan versi UI agar langsung dipakai kembali di komponen
    return updatedRaw ? apiToUi(updatedRaw) : null
  } catch (error: unknown) {
    const err = error as { response?: { data?: unknown } }
    if (err.response) {
      console.error("❌ Error updateCustomer:", err.response.data)
    } else {
      console.error("❌ Error updateCustomer:", error)
    }
    return null
  }
}

