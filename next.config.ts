import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  output: "export",
  serverExternalPackages: ["better-sqlite3"],
  basePath: isProd ? '/bible-clock' : '',
  assetPrefix: isProd ? '/bible-clock/' : '',
};

export default nextConfig;
