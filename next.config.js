/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  experimental: {
    appDir: true,
  },
}

// module.exports = nextConfig

const withPWA = require('next-pwa')({
  dest: 'public',
})

module.exports = withPWA({
  // next.js config
  ...nextConfig,
})
