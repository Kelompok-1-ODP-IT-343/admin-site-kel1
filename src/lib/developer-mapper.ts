// Bentuk data dari API (camelCase)
export type ApiDeveloper = {
  id: number
  companyName: string
  contactPerson: string
  phone: string
  email: string
  website: string
  address: string
  city: string
  province: string
  postalCode: string
  establishedYear: number
  description: string
  partnershipLevel: string
  status: string
}

// Bentuk data UI kamu (snake_case)
export type UiDeveloper = {
  id: string
  companyName: string
  contact_person: string
  phone: string
  email: string
  website: string
  address: string
  city: string
  province: string
  postal_code: string
  established_year: string
  description: string
  partnership_level: string
  logo?: string
  status: string
}

export const apiToUi = (d: ApiDeveloper): UiDeveloper => ({
  id: String(d.id),
  companyName: d.companyName,
  contact_person: d.contactPerson,
  phone: d.phone,
  email: d.email,
  website: d.website?.startsWith("http") ? d.website : `https://${d.website}`,
  address: d.address,
  city: d.city,
  province: d.province,
  postal_code: d.postalCode,
  established_year: String(d.establishedYear ?? ""),
  description: d.description,
  partnership_level: d.partnershipLevel, // "GOLD"/"SILVER" dst
  status: d.status,
})

export const uiToApi = (d: UiDeveloper): Partial<ApiDeveloper> => ({
  companyName: d.companyName,
  contactPerson: d.contact_person,
  phone: d.phone,
  email: d.email,
  website: d.website,
  address: d.address,
  city: d.city,
  province: d.province,
  postalCode: d.postal_code,
  establishedYear: Number(d.established_year || 0),
  description: d.description,
  partnershipLevel: d.partnership_level?.toUpperCase(), // "Gold" -> "GOLD"
  status: d.status,
})
