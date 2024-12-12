/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // Changed back to 'standalone' to support dynamic features
  images: {
    unoptimized: true,
  },
  trailingSlash: true
}

module.exports = nextConfig
