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

export async function uploadPropertyImage(file: File) {
  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) throw new Error("Token tidak ditemukan di cookie");

    const formData = new FormData();
    formData.append("image", file); // ⬅️ pastikan key = "image" sesuai Postman kamu

    const res = await fetch("http://local-dev.satuatap.my.id/api/v1/admin/image", {
    // const res = await fetch("http://localhost:18080/api/v1/admin/image", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Gagal upload gambar (status: ${res.status})`);
    }

    const json = await res.json();
    return { success: true, data: json };
  } catch (error: any) {
    console.error("Error uploadPropertyImage:", error);
    return { success: false, message: error.message };
  }
}

export async function createProperty(data: any) {
  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) throw new Error("Token tidak ditemukan di cookie");

    // const res = await fetch("http://localhost:18080/api/v1/properties", {
    const res = await fetch("http://local-dev.satuatap.my.id/api/v1/properties", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    // --- 💥 tambahkan pemeriksaan status dan log detail error di sini ---
    let json;
    try {
      json = await res.json();
    } catch (err) {
      json = { success: false, message: "Response bukan JSON" };
    }

    if (!res.ok) {
      // log detail error HTTP
      console.error("❌ HTTP Error:", res.status, json);
      throw new Error(json.message || `HTTP ${res.status}`);
    }

    // periksa flag success di body response
    if (!json.success) {
      throw new Error(json.message || "Gagal menyimpan properti");
    }

    return { success: true, data: json.data };
  } catch (error: any) {
    console.error("Error createProperty:", error);
    return { success: false, message: error.message };
  }
}



export async function getAdminProperties() {
  try {
    // 🔹 ambil token dari cookie browser
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1]

    if (!token) throw new Error("Token tidak ditemukan di cookie")

    // const res = await fetch("http://localhost:18080/api/v1/admin/properties", {
    const res = await fetch("http://local-dev.satuatap.my.id/api/v1/admin/properties", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ⬅️ kirim token dari cookie
      },
    })

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)

    const json = await res.json()
    if (json.success) return { success: true, data: json.data }

    return { success: false, message: json.message || "Gagal mengambil data" }
  } catch (error) {
    console.error("Error fetching properties:", error)
    return { success: false, message: "Terjadi kesalahan saat mengambil data" }
  }
}


export async function updateProperty(id: string | number, data: Partial<Property>) {
  const token = document.cookie
    .split("; ")
    .find((r) => r.startsWith("token="))
    ?.split("=")[1];

  // Kirim hanya field yang boleh diupdate (hindari id & image_url)
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
    "developer_id", // 🔥 tambahkan ini
    ];


  const filteredData: Record<string, any> = {};
  for (const key of allowedFields) {
    if (data[key as keyof Property] !== undefined) {
      filteredData[key] = data[key as keyof Property];
    }
  }
  console.log("🔍 PUT BODY:", JSON.stringify(filteredData, null, 2))

  // const res = await fetch(`http://localhost:18080/api/v1/admin/properties/${id}`, {
  const res = await fetch(`http://local-dev.satuatap.my.id/api/v1/admin/properties/${id}`, {
  
  
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(filteredData),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HTTP ${res.status}: ${errText}`);
  }

  return await res.json();
}

