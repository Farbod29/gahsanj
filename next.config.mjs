/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { hostname: 'irantasvir.com' },
      { hostname: 'miro.medium.com' },
      { hostname: 'www.imgonline.com.ua' },
      { hostname: 'www.imgonline.com' },
      { hostname: 'gahshomar.com' },
      { hostname: 'https://picsum.photos' },
      // { hostname: 'http://news.bbc.co.uk/' },
      { hostname: 'https://fa.wikipedia.org/' },
      {
        hostname: 'https://gahshomar.com',
      },
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
