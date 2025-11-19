"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const MIN_DESKTOP_WIDTH = 1024;

export default function UnsupportedDevice() {
  const router = useRouter();
  const search = useSearchParams();
  const from = search.get("from") || "/login";

  useEffect(() => {
    const maybeGoBack = () => {
      if (typeof window !== "undefined" && window.innerWidth >= MIN_DESKTOP_WIDTH) {
        router.replace(from);
      }
    };
    // Cek saat mount dan ketika ukuran berubah
    maybeGoBack();
    const onResize = () => maybeGoBack();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [router, from]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3FD8D4] via-white to-[#DDEE59] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="w-16 h-16 bg-[#FF8500] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-[#FF8500]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6m6 6V6" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Desktop-Only Access
        </h1>
        <p className="text-[#757575] mb-4">
          Demi keamanan data dan akurasi kerja, panel admin dirancang untuk
          layar lebar agar tabel, grafik, dan informasi sensitif tampil
          lengkap tanpa potensi salah input.
        </p>
        <div className="text-sm text-gray-600 text-left space-y-2 mb-6">
          <p>Kenapa perlu desktop?</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Menjaga visibilitas penuh data operasional dan audit trail.</li>
            <li>Meminimalkan kesalahan input pada form yang kompleks.</li>
            <li>Mendukung akses aman untuk aktivitas berisiko tinggi.</li>
          </ul>
        </div>
        <div className="flex items-center gap-3 justify-center">
          <button
            className="px-4 py-2 rounded-lg bg-[#111827] text-white hover:opacity-90"
            onClick={() => {
              if (typeof window !== "undefined" && window.innerWidth >= MIN_DESKTOP_WIDTH) {
                router.replace(from);
              }
            }}
          >
            Coba lagi di layar lebar
          </button>
          <a
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
            href={from}
          >
            Buka tujuan setelah pindah ke desktop
          </a>
        </div>
      </div>
    </div>
  )
}
