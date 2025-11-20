// src/services/creditScore.ts
import axios, { AxiosHeaders } from "axios";

export type CreditScoreResponse = {
  score: number;
  user_id: string;
  breakdown?: Record<string, number>;
  input_used?: Record<string, any>;
  note?: string;
  success?: boolean;
};

// Helper: ambil token dari cookie (copy dari coreApi tapi ringan)
function getTokenFromCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith(name + "="))
      ?.split("=")[1] || null
  );
}

const creditApi = axios.create({
  baseURL: "https://ai.satuatap.my.id/api/v2",
  timeout: 15000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Sisipkan Authorization otomatis
creditApi.interceptors.request.use((config) => {
  try {
    const token = getTokenFromCookie("token");
    if (token) {
      if (config.headers instanceof AxiosHeaders) {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers = new AxiosHeaders(config.headers as any);
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }
  } catch (e) {
    console.warn("Tidak bisa menambahkan Authorization header (credit score)");
  }
  return config;
});

export async function getCreditScore(
  userId: string | number
): Promise<CreditScoreResponse | null> {
  try {
    const payload = { user_id: String(userId) };
    const res = await creditApi.post("/credit-score", payload);
    const data: CreditScoreResponse = res.data;
    if (typeof data.score === "number") return data;
    return null;
  } catch (error: any) {
    if (error?.response?.status === 401) {
      console.error(
        "❌ Unauthorized saat ambil credit score. Pastikan token cookie ada."
      );
    } else {
      console.error(
        "❌ Error fetching credit score:",
        error?.response?.data || error.message
      );
    }
    return null;
  }
}
