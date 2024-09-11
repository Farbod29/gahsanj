/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['gahshomar.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'irantasvir.com',
      },
      {
        protocol: 'https',
        hostname: 'miro.medium.com',
      },
      {
        protocol: 'https',
        hostname: 'www.imgonline.com.ua',
      },
      {
        protocol: 'https',
        hostname: 'www.imgonline.com',
      },
      {
        protocol: 'https',
        hostname: 'gahshomar.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'fa.wikipedia.org',
      },
    ],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });

    return config;
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

// Use export default instead of module.exports
export default nextConfig;
