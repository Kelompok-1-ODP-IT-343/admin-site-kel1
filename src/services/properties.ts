// src/services/properties.ts
import coreApi from "@/lib/coreApi"

export type Property = {
  id: number;
  title: string;
  description: string;
  address: string;
  subDistrict: string;
  district: string;
  city: string;
  province: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  landArea: number;
  buildingArea: number;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  garage: number;
  yearBuilt: number;
  price: number;
  pricePerSqm: number;
  maintenanceFee: number;
  certificateType: string;
  pbbValue: number;
  developerName: string;
  developerId?: number;
  propertyType: string;
  imageUrl: string;
  status: string;
  features?: { featureName: string; featureValue: string }[];
  locations?: { poiName: string; distanceKm: number }[];
};


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
// ✅ Utility reusable untuk filter data properti yang boleh diupdate
export function filterEditableFields(data: any) {
  const allowedFields = [
    // === BASIC ===
    "title",
    "description",
    "status",
    "propertyType",
    "developerId",
    "address",
    "city",
    "province",
    "district",
    "subDistrict",
    "postalCode",
    "latitude",
    "longitude",

    // === NUMERIC FIELDS ===
    "price",
    "pricePerSqm",
    "bedrooms",
    "bathrooms",
    "floors",
    "garage",
    "yearBuilt",
    "landArea",
    "buildingArea",

    // === FINANCIAL & LEGAL ===
    "certificateType",
    "maintenanceFee",
    "pbbValue",

    // === OPTIONAL ARRAYS (kalau backend support) ===
    "features",
    "locations",
  ];

  const filtered: Record<string, any> = {};
  for (const key of allowedFields) {
    if (data[key] !== undefined && data[key] !== null) {
      filtered[key] = data[key];
    }
  }
  return filtered;
}




// 🔹 Update properti berdasarkan ID
export async function updateProperty(id: string | number, data: Partial<Property>) {
  try {
    const filteredData = filterEditableFields(data); // ✅ panggil fungsi di atas
    console.log("📡 PUT BODY TERKIRIM:", filteredData);

    const res = await coreApi.put(`/admin/properties/${id}`, filteredData);
    return res.data;
  } catch (error: any) {
    console.error(`❌ Error updateProperty(${id}):`, error);
    return { success: false, message: error.message };
  }
}
