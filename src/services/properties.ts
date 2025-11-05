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
    developerId?: number;
    developerName?: string;
  propertyType: string;
  imageUrl: string;
  status: string;
  features?: { featureName: string; featureValue: string }[];
  locations?: { poiName: string; distanceKm: number }[];

  // === API/List snake_case compatibility (optional) ===
  developer_name?: string;
  property_type?: string;
  price_per_sqm?: number;
  land_area?: number;
  building_area?: number;
  year_built?: number;
  sub_district?: string;
  postal_code?: string;
  pbb_value?: number;
  image_url?: string;
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
// ✅ Utility untuk memetakan field UI (snake_case) ke payload API (camelCase)
export function filterEditableFields(data: any) {
  const keyMap: Record<string, string> = {
    // === BASIC ===
    title: "title",
    description: "description",
    status: "status",
    property_type: "propertyType",
    propertyType: "propertyType",
    developer_id: "developerId",
    developerId: "developerId",
    developer_name: "developerName",
    developerName: "developerName",
    address: "address",
    city: "city",
    province: "province",
    district: "district",
    sub_district: "village", // backend menggunakan 'village'
    subDistrict: "village",
    postal_code: "postalCode",
    postalCode: "postalCode",
    latitude: "latitude",
    longitude: "longitude",

    // === NUMERIC FIELDS ===
    price: "price",
    price_per_sqm: "pricePerSqm",
    pricePerSqm: "pricePerSqm",
    bedrooms: "bedrooms",
    bathrooms: "bathrooms",
    floors: "floors",
    garage: "garage",
    year_built: "yearBuilt",
    yearBuilt: "yearBuilt",
    land_area: "landArea",
    landArea: "landArea",
    building_area: "buildingArea",
    buildingArea: "buildingArea",

    // === FINANCIAL & LEGAL ===
    certificate_type: "certificateType",
    certificateType: "certificateType",
    maintenance_fee: "maintenanceFee",
    maintenanceFee: "maintenanceFee",
    pbb_value: "pbbValue",
    pbbValue: "pbbValue",

    // === META/OPTIONAL ===
    image_url: "imageUrl",
    imageUrl: "imageUrl",
    availability_date: "availabilityDate",
    availabilityDate: "availabilityDate",
    handover_date: "handoverDate",
    handoverDate: "handoverDate",
    is_featured: "isFeatured",
    isFeatured: "isFeatured",
    is_kpr_eligible: "isKprEligible",
    isKprEligible: "isKprEligible",
    min_down_payment_percent: "minDownPaymentPercent",
    minDownPaymentPercent: "minDownPaymentPercent",
    max_loan_term_years: "maxLoanTermYears",
    maxLoanTermYears: "maxLoanTermYears",
    meta_title: "metaTitle",
    metaTitle: "metaTitle",
    meta_description: "metaDescription",
    metaDescription: "metaDescription",
    keywords: "keywords",
  };

  const numericKeys = new Set([
    "latitude",
    "longitude",
    "landArea",
    "buildingArea",
    "bedrooms",
    "bathrooms",
    "floors",
    "garage",
    "yearBuilt",
    "price",
    "pricePerSqm",
    "maintenanceFee",
    "pbbValue",
    // Pastikan developerId dikirim sebagai number
    "developerId",
    "minDownPaymentPercent",
    "maxLoanTermYears",
  ]);

  const filtered: Record<string, any> = {};
  for (const rawKey of Object.keys(data)) {
    const targetKey = keyMap[rawKey];
    if (!targetKey) continue;

    let value = data[rawKey];
    if (numericKeys.has(targetKey)) {
      // hilangkan karakter non-numerik lalu konversi
      if (typeof value === "string") {
        const cleaned = value.replace(/[^0-9.-]/g, "");
        const num = Number(cleaned);
        value = isNaN(num) ? value : num;
      }
    }

    if (value !== undefined && value !== null && value !== "") {
      filtered[targetKey] = value;
    }
  }
  return filtered;
}




// 🔹 Update properti berdasarkan ID
export async function updateProperty(id: string | number, data: Partial<Property>) {
  try {
    const payload = filterEditableFields(data);
    console.log("📡 PUT BODY TERKIRIM:", payload);

    // Endpoint: {{host}}admin/properties/:id
    const res = await coreApi.put(`/admin/properties/${id}`, payload);
    return res.data;
  } catch (error: any) {
    console.error(`❌ Error updateProperty(${id}):`, error);
    return { success: false, message: error.message };
  }
}

// 🔹 Hapus properti berdasarkan ID
export async function deleteProperty(id: string | number) {
  try {
    const res = await coreApi.delete(`/admin/properties/${id}`);
    if (res.status >= 200 && res.status < 300) {
      return { success: true };
    }
    return { success: false, message: res.data?.message || "Gagal menghapus properti" };
  } catch (error: any) {
    console.error(`❌ Error deleteProperty(${id}):`, error);
    return { success: false, message: error.message };
  }
}
