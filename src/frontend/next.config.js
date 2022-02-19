/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    NEXT_PUBLIC_BASE_URL: 'http://fortice.iptime.org:8080',
  },
  reactStrictMode: true,
  images: {
    domains: ['cdn.akamai.steamstatic.com', 'store.akamai.steamstatic.com', 'cdn.cloudflare.steamstatic.com'],
  },
};
