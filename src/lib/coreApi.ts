import axios, { AxiosHeaders } from "axios";

// Helper function to get token from cookies
const getTokenFromCookie = (): string | null => {
  if (typeof window === "undefined") return null;
  
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
  
  return token || null;
};

// Axios instance untuk seluruh request ke API Satu Atap
const coreApi = axios.create({
  baseURL: "http://local-dev.satuatap.my.id/api/v1",
  // baseURL: "http://localhost:18080/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor: sisipkan Authorization jika ada token di cookies
coreApi.interceptors.request.use((config) => {
  try {
    const token = getTokenFromCookie();
    if (token) {
      if (config.headers instanceof AxiosHeaders) {
        config.headers.set("Authorization", `Bearer ${token}`);
      } else {
        config.headers = new AxiosHeaders(config.headers as any);
        config.headers.set("Authorization", `Bearer ${token}`);
      }
    }
  } catch (error) {
    console.error("Error adding auth token:", error);
  }
  return config;
});

// Interceptor response: kembalikan response apa adanya, propagasi error
coreApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default coreApi;