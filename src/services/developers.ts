// function getCookie(name: string) {
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(";").shift();
// }

// export async function fetchDevelopers(page = 0, size = 10) {
//   try {
//     const token = getCookie("token"); // ambil token dari cookie
//     console.log("🔐 Token dikirim:", token);

//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_HOST}/api/v1/admin/developers?page=${page}&size=${size}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`, // <– wajib dikirim
//         },
//         credentials: "include", // <– biar cookie juga dikirim
//         cache: "no-store",
//       }
//     );

//     if (!res.ok) {
//       console.error("❌ Gagal:", res.status);
//       return [];
//     }

//     const json = await res.json();
//     console.log("✅ Hasil API:", json);
//     return json?.data?.data ?? [];
//   } catch (error) {
//     console.error("🚨 Error fetch developers:", error);
//     return [];
//   }
// }

function getTokenFromCookie() {
  if (typeof document === "undefined") return null
  return document.cookie
    .split("; ")
    .find(c => c.startsWith("token="))
    ?.split("=")[1] || null
}

const API = process.env.NEXT_PUBLIC_API_HOST

export async function updateDeveloperStatus(id: string, status: "ACTIVE" | "INACTIVE") {
  const token =
    typeof document !== "undefined"
      ? document.cookie.split("; ").find(c => c.startsWith("token="))?.split("=")[1]
      : null;

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/v1/admin/developers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error(`Failed to update status: ${res.status}`);
  return await res.json();
}



export async function getDeveloperById(id: string | number) {
  const token = getTokenFromCookie()
  const res = await fetch(`${API}/api/v1/admin/developers/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    cache: "no-store",
  })
  if (!res.ok) throw new Error(`GET /developers/${id} -> ${res.status}`)
  return res.json() // {success, data: {...}}
}

export async function updateDeveloper(
  id: string | number,
  payload: any
) {
  const token = getTokenFromCookie()
  const res = await fetch(`${API}/api/v1/admin/developers/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    credentials: "include",
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`PUT /developers/${id} -> ${res.status}`)
  return res.json() // {success, data: {...}}
}
