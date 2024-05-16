/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'irantasvir.com' },
      { hostname: 'miro.medium.com' },
      { hostname: 'www.imgonline.com.ua' },
      { hostname: 'www.imgonline.com' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*', // Matched parameters can be used in the destination
      },
    ];
  },
};

export default nextConfig;
