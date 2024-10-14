/** @type {import('next').NextConfig} */
module.exports = {
  output: "standalone",
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID || '15vgdcuna3qsic6tgtj9dtk43k',
    COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET || '1iorcfrkb2t39p74ucjte2utnu5qtpfega343ce9pgn1a766b9er',
    COGNITO_ISSUER: process.env.COGNITO_ISSUER || 'https://cognito-idp.ap-southeast-1.amazonaws.com/ap-southeast-1_aZZSWtfOf',
    AUTH_SECRET: process.env.AUTH_SECRET || '9a69b44c302b7c5c20820cbfa1038a88'
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
