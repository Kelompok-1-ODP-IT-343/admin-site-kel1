export async function getAllUsers() {
  try {
    // 🔹 Ambil token dari cookie
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) throw new Error("Token tidak ditemukan di cookie");

    // const res = await fetch("http://localhost:18080/api/v1/admin/users", { 
    const res = await fetch("http://local-dev.satuatap.my.id/api/v1/admin/users", { 
    
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    // 🔹 Cek status response dulu
    if (!res.ok) {
      console.error("❌ Fetch gagal:", res.status);
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    // 🔹 Kalau OK, parse JSON-nya
    const json = await res.json();

    // 🔹 Debugging: tampilkan hasil response
    console.log("➡️ STATUS:", res.status);
    console.log("📦 HASIL API:", json);

    // 🔹 Kembalikan array data user
    return json.data?.data || [];
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return [];
  }
}

export async function deleteUser(id: string) {
  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) throw new Error("Token tidak ditemukan di cookie");

    const res = await fetch(`http://local-dev.satuatap.my.id/api/v1/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("❌ Gagal menghapus user:", res.status);
      const errorText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errorText}`);
    }

    console.log(`✅ User ${id} berhasil dihapus`);
    return true;
  } catch (error) {
    console.error("❌ Error deleteUser:", error);
    return false;
  }
}
