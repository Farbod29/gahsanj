/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dcr52vdzb/**',
      },
    ],
  },
};

module.exports = nextConfig;
