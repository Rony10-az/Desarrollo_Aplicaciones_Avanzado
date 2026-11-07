import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  images: {
    // Las fotos fijas (hero, tarjetas, textura de pagina) ahora viven en
    // public/images/ -- solo las portadas reales de libros (por ISBN,
    // dinamicas, no se pueden pre-descargar) siguen viniendo de afuera.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "covers.openlibrary.org",
        port: "",
        pathname: "/**",
      },
    ],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
