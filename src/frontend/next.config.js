/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    NEXT_PUBLIC_BASE_URL_CHARGE: 'http://fortice.iptime.org:8080',
    NEXT_PUBLIC_BASE_URL_MEMBERSHIP: 'http://fortice.iptime.org:8080',
    NEXT_PUBLIC_BASE_URL_STORE: 'http://fortice.iptime.org:8080',
    NEXT_PUBLIC_BASE_URL_AUTH: 'http://localhost:8101',
    NEXT_PUBLIC_BASE_URL_WS: 'ws://fortice.iptime.org:8080/library',
  },
  reactStrictMode: true,
  images: {
    domains: ['cdn.akamai.steamstatic.com'],
  },
};
