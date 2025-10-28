const baseUrl = ""

export async function getUserProfile() {
  try {
    // Ambil token dari cookie
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) throw new Error("No token found in cookies");

    const res = await fetch("http://localhost:18080/api/v1/user/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Backend response:", text);
      throw new Error("Failed to fetch user profile");
    }

    const json = await res.json();
    return json.data; // ambil langsung object data
  } catch (err) {
    console.error("❌ getUserProfile error:", err);
    return null;
  }
}
