/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/v2/:path*',
        destination: 'http://localhost:8000/api/v2/:path*'
      }
    ];
  }
};

module.exports = nextConfig; 