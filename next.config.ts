import type { NextConfig } from 'next';
import { loadSecrets } from './loadSecrets';

const secrets = loadSecrets(); // Secrets aus dem Secrets Manager laden

console.log("AWS_ACCESS_KEY_ID:", secrets.AWS_ACCESS_KEY_ID);
console.log("AWS_SECRET_ACCESS_KEY:", secrets.AWS_SECRET_ACCESS_KEY);
console.log("AWS_SESSION_TOKEN:", secrets.AWS_SESSION_TOKEN);

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  env: {
    AWS_ACCESS_KEY_ID: secrets.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: secrets.AWS_SECRET_ACCESS_KEY,
    AWS_SESSION_TOKEN: secrets.AWS_SESSION_TOKEN,
    AWS_REGION: 'us-east-1',
    S3_BUCKET_NAME: 'bucket-mit-cooli-bilder',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bucket-mit-cooli-bilder.s3.us-east-1.amazonaws.com',
      },
    ],
  },
};

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;


