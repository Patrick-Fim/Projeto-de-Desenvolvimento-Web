/** @type {import('next').NextConfig} */
const nextConfig = {
  // Gera um site estático (pasta out/) para o Firebase Hosting gratuito.
  output: 'export',
  images: { unoptimized: true },
  reactCompiler: true,
};

export default nextConfig;
