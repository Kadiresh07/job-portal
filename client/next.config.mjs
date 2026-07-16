/** @type {import('next').NextConfig} */
const nextConfig = {
  // Treat ESLint warnings as warnings, not errors, during builds
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Don't fail build on TypeScript errors (JS project)
  typescript: {
    ignoreBuildErrors: false,
  },
  // Required for standalone output on Vercel (optional but good practice)
  output: "standalone",
};

export default nextConfig;
