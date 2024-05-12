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
};

export default nextConfig;
