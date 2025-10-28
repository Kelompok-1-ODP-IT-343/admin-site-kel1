// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   // menghasilkan .next/standalone untuk runtime container
//   output: "standalone",
//   // agar build tidak gagal karena lint errors
//   eslint: {
//     ignoreDuringBuilds: true,
//   },
//   // agar build tidak gagal karena type errors
//   typescript: {
//     ignoreBuildErrors: true,
//   },
// };

// export default nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ["is3.cloudhost.id"], // 🔥 tambahkan ini
//   },
// };

// module.exports = nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // menghasilkan .next/standalone untuk runtime container
  output: "standalone",

  // agar build tidak gagal karena lint errors
  eslint: {
    ignoreDuringBuilds: true,
  },

  // agar build tidak gagal karena type errors
  typescript: {
    ignoreBuildErrors: true,
  },

  // 🔥 tambahkan domain gambar eksternal di sini
  images: {
    domains: ["is3.cloudhost.id"],
  },
};

export default nextConfig;
