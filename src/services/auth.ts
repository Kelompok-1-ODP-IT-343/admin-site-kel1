// src/services/auth.ts
// const baseUrl = "http://localhost:18080/"
export async function loginBlueprint({
  identifier,
  password,
}: {
  identifier: string;
  password: string;
}) {
  try {
    // const res = await fetch("http://localhost:18080/api/v1/auth/login", {
    const res = await fetch("http://local-dev.satuatap.my.id/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ identifier, password }), // ✅ tetap pakai identifier
    });

    const data = await res.json();

    // Periksa apakah request berhasil
    if (!res.ok || !data.success) {
      return { success: false, message: data.message || "Login gagal" };
    }

    // ✅ Simpan token ke cookie biar bisa dibaca middleware
    if (data.data?.token) {
      document.cookie = `token=${data.data.token}; path=/; max-age=86400;`;
      return { success: true, data: data.data };
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Gagal terhubung ke server" };
  }
}
