import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Ignora erros de lint durante o build na Vercel
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignora erros de tipagem durante o build
    ignoreBuildErrors: true,
  },

};

export default nextConfig;
