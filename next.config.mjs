/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  serverExternalPackages: ["iyzipay"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
        pathname: '/**',
      }
    ],
    domains: ['res.cloudinary.com', 'cloudinary.com'],
  },
  experimental: {
    turbo: {
      // Turbopack için genel ayarlar
      resolveAlias: {
        // Mevcut alias ayarları olursa buraya eklenebilir
      },
    },
  },
};

export default nextConfig;
