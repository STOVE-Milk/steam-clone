/** @type {import('next').NextConfig} */
module.exports = {
  env: {
    NEXT_PUBLIC_BASE_URL_CHARGE: 'http://fortice.iptime.org:8080',
    NEXT_PUBLIC_BASE_URL_MEMBERSHIP: 'http://fortice.iptime.org:8080',
    NEXT_PUBLIC_BASE_URL_STORE: 'http://54.180.117.120:8100',
    NEXT_PUBLIC_BASE_URL_AUTH: 'http://localhost:8081',
  },
  reactStrictMode: true,
  images: {
    domains: ['cdn.akamai.steamstatic.com'],
  },
};
