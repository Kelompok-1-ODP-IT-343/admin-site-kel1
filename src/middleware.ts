import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function isMobileOrTablet(ua: string, secChUaMobile?: string) {
  const mobileRegex =
    /(Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini)/i;
  const tabletRegex = /(iPad|Tablet|Nexus 7|Nexus 10|KFAPWI|Silk)/i;
  const isClientHintMobile = secChUaMobile?.includes("?1");
  return mobileRegex.test(ua) || tabletRegex.test(ua) || !!isClientHintMobile;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip assets & API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    /\.(png|jpg|jpeg|gif|svg|webp|ico|css|js)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // Device-Based Access Restriction (Desktop-Only)
  const ua = req.headers.get("user-agent") || "";
  const secChUaMobile = req.headers.get("sec-ch-ua-mobile") || undefined;

  if (
    isMobileOrTablet(ua, secChUaMobile) &&
    !pathname.startsWith("/unsupported-device")
  ) {
    const url = req.nextUrl.clone();
    url.pathname = "/unsupported-device";
    // Sertakan rute asal untuk kembali otomatis saat kembali ke desktop
    const from = `${req.nextUrl.pathname}${req.nextUrl.search}`;
    url.searchParams.set("from", from);
    return NextResponse.redirect(url);
  }

  // Proteksi dashboard: jika token kosong tetapi refreshToken ada, biarkan lanjut
  // agar client-side interceptor bisa melakukan refresh otomatis.
  const token = req.cookies.get("token")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!token && pathname.startsWith("/dashboard")) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    // ada refreshToken → lanjutkan
    return NextResponse.next();
  }

  // Kalau sudah login tapi buka /login, redirect ke /dashboard
  if (token && req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Lanjut ke halaman berikutnya
  return NextResponse.next();
}

// Tentukan rute yang ingin dilindungi (exclude assets & api)
export const config = {
  matcher: ["/((?!_next|api|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js)).*)"],
};
