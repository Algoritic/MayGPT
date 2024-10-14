/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID || 'xxx',
    COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET || 'xxx',
    COGNITO_ISSUER: process.env.COGNITO_ISSUER || 'xxx',
    AUTH_SECRET: process.env.AUTH_SECRET || 'xxx'
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '**'
      }
    ]
  }
}
