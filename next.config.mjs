import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['next-auth', '@auth/core'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    resolveAlias: {
      tailwindcss: path.resolve(__dirname, 'node_modules/tailwindcss'),
    },
  },
  webpack: (config) => {
    // Fix: Next.js detects the parent directory as monorepo root and sets
    // webpack context to D:\programacion\dashboard-hamburgueseria instead of dashboard-demo/.
    // Also: pnpm uses Windows junctions; resolve.symlinks:false prevents webpack from
    // following junctions to their real path (inside .pnpm), which breaks module traversal.
    config.context = path.resolve(__dirname);
    config.resolve.symlinks = false;
    config.resolve.modules = [
      path.resolve(__dirname, 'node_modules'),
      ...(config.resolve.modules || ['node_modules']),
    ];
    config.resolve.alias = {
      ...config.resolve.alias,
      tailwindcss: path.resolve(__dirname, 'node_modules/tailwindcss'),
    };
    return config;
  },
};

export default nextConfig;
