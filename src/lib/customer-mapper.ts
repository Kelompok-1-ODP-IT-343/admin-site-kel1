// src/lib/customer-mapper.ts
import { Customer } from "@/services/customers"

export function apiToUi(api: any): Customer {
  return {
    id: String(api.id),

    // --- Data Profil ---
    name: api.fullName ?? "-",
    username: api.username ?? "-",
    email: api.email ?? "-",
    phone: api.phone ?? "-",
    nik: api.nik ?? "-",
    npwp: api.npwp ?? "-",
    birth_date: api.birthDate ?? "-",
    birth_place: api.birthPlace ?? "-",
    gender: api.gender ?? "-",
    marital_status: api.maritalStatus ?? "-",
    address: api.address ?? "-",
    sub_district: "-", // ❌ belum ada di backend
    district: "-",     // ❌ belum ada di backend
    city: api.city ?? "-",
    province: api.province ?? "-",
    postal_code: api.postalCode ?? "-",
    ktp: "", // ❌ belum ada di backend
    slip: "", // ❌ belum ada di backend
    credit_score: 3, // fallback dummy (karena belum ada di backend)
    credit_status: "Lancar", // fallback dummy

    // --- Data Pekerjaan ---
    occupation: api.occupation ?? "-",
    company_postal_code: "-", // ❌ belum ada
    company_name: api.companyName ?? "-",
    company_address: "-", // ❌ belum ada
    company_district: "-", // ❌ belum ada
    company_subdistrict: "-", // ❌ belum ada
    company_city: "-", // ❌ belum ada
    company_province: "-", // ❌ belum ada
    monthly_income: String(api.monthlyIncome ?? "0"),
  }
}

// Ubah data UI ke bentuk payload API
export function uiToApi(ui: Customer) {
  return {
    fullName: ui.name,
    username: ui.username,
    email: ui.email,
    phone: ui.phone,
    nik: ui.nik,
    npwp: ui.npwp,
    birthDate: ui.birth_date,
    birthPlace: ui.birth_place,
    gender: ui.gender,
    maritalStatus: ui.marital_status,
    address: ui.address,
    city: ui.city,
    province: ui.province,
    postalCode: ui.postal_code,
    occupation: ui.occupation,
    companyName: ui.company_name,
    monthlyIncome: ui.monthly_income,
  }
}
