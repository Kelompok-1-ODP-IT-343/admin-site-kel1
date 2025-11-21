import axios, { AxiosHeaders } from "axios";
// const BASE_URL = "http://local-dev.satuatap.my.id/api/v1";
const BASE_URL = "https://satuatap.my.id/api/v1";
// const BASE_URL = "http://localhost:18080/api/v1";

let isRefreshing = false;
let failedQueue: any[] = [];
// Helper function to get token from cookies
const getTokenFromCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

  return token || null;
};

const setCookie = (name: string, value: string, maxAge: number) => {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
};

// Axios instance untuk seluruh request ke API Satu Atap
const coreApi = axios.create({
  baseURL: BASE_URL,
  timeout: 1500000,
  headers: {
    Accept: "application/json",
  },
});

// Klien terpisah untuk refresh token agar tidak terpengaruh interceptor
const refreshClient = axios.create({
  baseURL: BASE_URL,
  headers: { Accept: "application/json" },
});

// Interceptor: sisipkan Authorization jika ada token di cookies
coreApi.interceptors.request.use((config) => {
  try {
    const isForm = (() => {
      if (!config || !config.data) return false;
      if (typeof FormData !== "undefined" && config.data instanceof FormData)
        return true;
      const tag = Object.prototype.toString.call(config.data);
      return (
        tag === "[object FormData]" ||
        (typeof (config.data as any)?.append === "function" &&
          (config.data as any)?.[Symbol.toStringTag] === "FormData")
      );
    })();
    if (isForm) {
      if (config.headers instanceof AxiosHeaders) {
        config.headers.delete("Content-Type");
      } else {
        config.headers = new AxiosHeaders(config.headers as any);
        config.headers.delete("Content-Type");
      }
    } else {
      const method = (config.method || "").toUpperCase();
      const needsJson =
        method === "POST" || method === "PUT" || method === "PATCH";
      if (needsJson) {
        if (config.headers instanceof AxiosHeaders) {
          if (!config.headers.get("Content-Type"))
            config.headers.set("Content-Type", "application/json");
        } else {
          config.headers = new AxiosHeaders(config.headers as any);
          if (!config.headers.get("Content-Type"))
            config.headers.set("Content-Type", "application/json");
        }
      }
    }
    const token = getTokenFromCookie("token");
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

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};
// Interceptor response: kembalikan response apa adanya, propagasi error
// coreApi.interceptors.response.use(
//   (response) => response,
//   (error) => Promise.reject(error)
// );

coreApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config as any;

    const status = error?.response?.status;
    // Kalau expired (401/403)
    if ((status === 401 || status === 403) && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return coreApi(originalRequest);
          })
          .catch(Promise.reject);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getTokenFromCookie("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        // Gunakan klien tanpa interceptor untuk refresh agar tidak loop
        const res = await refreshClient.post("/auth/refresh", { refreshToken });

        const payload = res?.data?.data ?? res?.data;
        const newToken =
          payload?.token ||
          payload?.accessToken ||
          payload?.access_token ||
          null;
        const newRefresh =
          payload?.refreshToken || payload?.refresh_token || null;

        if (newToken) {
          setCookie("token", newToken, 900); // 15 menit
          if (newRefresh) setCookie("refreshToken", newRefresh, 86400);
          processQueue(null, newToken);

          originalRequest.headers["Authorization"] = "Bearer " + newToken;
          return coreApi(originalRequest);
        } else {
          processQueue(new Error("No new token"), null);
          throw new Error("Invalid refresh response");
        }
      } catch (err) {
        processQueue(err, null);
        document.cookie = "token=; Max-Age=0; path=/";
        document.cookie = "refreshToken=; Max-Age=0; path=/";
        window.location.href = "/login";
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
export async function uploadFetch(
  path: string,
  formData: FormData,
  init?: RequestInit
) {
  const token = getTokenFromCookie("token");
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method: "POST",
    body: formData,
    headers,
    ...init,
  });
  const text = await res.text();
  let data: any = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }
  if (!res.ok) {
    const message =
      (data && (data.message || data.error)) || text || `HTTP ${res.status}`;
    throw new Error(message);
  }
  return data ?? text;
}
export default coreApi;
