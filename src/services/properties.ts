// src/services/properties.ts
import coreApi from "@/lib/coreApi"

export type Property = {
  id: string
  title: string
  description: string
  address: string
  sub_district: string
  district: string
  city: string
  province: string
  postal_code: string
  latitude: number
  longitude: number
  land_area: number
  building_area: number
  bedrooms: number
  bathrooms: number
  floors: number
  garage: number
  year_built: number
  price: number
  price_per_sqm: number
  maintenance_fee: number
  certificate_type: string
  pbb_value: number
  developer_name: string
  image_url: string
  property_type: string
}

// 🔹 Upload gambar properti (form-data)
export async function uploadPropertyImage(file: File) {
  try {
    const formData = new FormData()
    formData.append("image", file) // pastikan key sesuai backend

    const res = await coreApi.post("/admin/image", formData, {
    })

    console.log("📸 Upload sukses:", res.data)
    return { success: true, data: res.data }
  } catch (error: any) {
    console.error("❌ Error uploadPropertyImage:", error)
    return { success: false, message: error.message }
  }
}

// 🔹 Buat properti baru
export async function createProperty(data: any) {
  try {
    const res = await coreApi.post("/properties", data)
    const json = res.data

    if (!json.success) throw new Error(json.message || "Gagal menyimpan properti")

    return { success: true, data: json.data }
  } catch (error: any) {
    console.error("❌ Error createProperty:", error)
    return { success: false, message: error.message }
  }
}

// 🔹 Ambil semua properti (admin)
export async function getAdminProperties() {
  try {
    const res = await coreApi.get("/admin/properties", {
    })
    const json = res.data

    if (json.success) return { success: true, data: json.data }
    return { success: false, message: json.message || "Gagal mengambil data" }
  } catch (error) {
    console.error("❌ Error fetching properties:", error)
    return { success: false, message: "Terjadi kesalahan saat mengambil data" }
  }
}

// 🔹 Update properti berdasarkan ID
export async function updateProperty(id: string | number, data: Partial<Property>) {
  try {
    const allowedFields = [
      "title",
      "description",
      "price",
      "price_per_sqm",
      "address",
      "city",
      "province",
      "district",
      "sub_district",
      "postal_code",
      "land_area",
      "building_area",
      "bedrooms",
      "bathrooms",
      "floors",
      "garage",
      "year_built",
      "certificate_type",
      "maintenance_fee",
      "pbb_value",
      "property_type",
      "developer_id",
    ]

    const filteredData: Record<string, any> = {}
    for (const key of allowedFields) {
      if (data[key as keyof Property] !== undefined) {
        filteredData[key] = data[key as keyof Property]
      }
    }

    console.log("🔍 PUT BODY:", filteredData)

    const res = await coreApi.put(`/admin/properties/${id}`, filteredData)
    return res.data
  } catch (error: any) {
    console.error(`❌ Error updateProperty(${id}):`, error)
    return { success: false, message: error.message }
  }
}
