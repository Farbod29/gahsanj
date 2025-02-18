/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'gahshomar.app',
      'www.gahshomar.app',
      'gahshomar.com',
      'irantasvir.com',
      'www.imgonline.com.ua',
      'miro.medium.com',
      'picsum.photos',
      'fa.wikipedia.org',
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

export default nextConfig;
