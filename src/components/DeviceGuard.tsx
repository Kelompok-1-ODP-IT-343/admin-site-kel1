"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Konfigurasi kebijakan akses desktop saja
const MIN_DESKTOP_WIDTH = 1024; // px

function isMobileLike(): boolean {
  if (typeof window === "undefined") return false;
  const w = window.innerWidth;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const narrowScreen = w < MIN_DESKTOP_WIDTH;
  const portraitLike = window.matchMedia("(orientation: portrait)").matches && w < 1200;
  return coarsePointer || narrowScreen || portraitLike;
}

export default function DeviceGuard() {
  const router = useRouter();

  useEffect(() => {
    const checkAndRoute = () => {
      const path = typeof window !== "undefined" ? window.location.pathname + window.location.search :
        "/";
      if (isMobileLike()) {
        if (!path.startsWith("/unsupported-device")) {
          const from = encodeURIComponent(path);
          router.replace(`/unsupported-device?from=${from}`);
        }
      } else {
        // Jika kembali ke desktop saat berada di halaman unsupported, arahkan balik ke tujuan awal
        if (path.startsWith("/unsupported-device")) {
          const params = new URLSearchParams(window.location.search);
          const from = params.get("from");
          if (from) {
            router.replace(from);
          } else {
            router.replace("/login");
          }
        }
      }
    };

    // Cek awal
    checkAndRoute();

    // Dengarkan perubahan ukuran layar & orientasi
    const onResize = () => checkAndRoute();
    const onOrientation = () => checkAndRoute();

    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onOrientation);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onOrientation);
    };
  }, [router]);

  return null;
}
