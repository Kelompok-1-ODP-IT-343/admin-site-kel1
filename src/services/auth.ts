import coreApi from "@/lib/coreApi";

// Kirim OTP (login tanpa token)
export async function loginBlueprint({
  identifier,
  password,
}: {
  identifier: string;
  password: string;
}) {
  try {
    const response = await coreApi.post("/auth/login", {
      identifier,
      password,
    });

    const data = response.data;

    // Periksa apakah request berhasil
    if (!data.success) {
      return { success: false, message: data.message || "Login gagal" };
    }

    // ❌ Jangan simpan token di sini
    return { success: true, data: data.data };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Gagal terhubung ke server" };
  }
}

// verifikasi OTP → simpan token
export async function verifyOtpBlueprint({
  identifier,
  otp,
}: {
  identifier: string;
  otp: string;
}) {
  try {
    const response = await coreApi.post("/auth/verify-otp", {
      identifier,
      otp,
      purpose: "login", // sesuai API Postman-mu
    });

    const data = response.data;

    if (!data.success) {
      return { success: false, message: data.message || "OTP tidak valid" };
    }

    // ✅ Token baru diset di sini setelah OTP benar
    if (data.data?.token) {
      document.cookie = `token=${data.data.token}; path=/; max-age=86400; SameSite=Lax`;
      document.cookie = `refreshToken=${data.data.refreshToken}; path=/; max-age=86400; SameSite=Lax`;
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error("Verify OTP error:", error);
    return { success: false, message: "Gagal verifikasi OTP" };
  }
}
