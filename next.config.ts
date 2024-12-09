import type { NextConfig } from "next";
require('dotenv').config();

//console.log("AWS_ACCESS_KEY_ID:", process.env.AWS_ACCESS_KEY_ID);
//console.log("AWS_SECRET_ACCESS_KEY:", process.env.AWS_SECRET_ACCESS_KEY);
//console.log("AWS_REGION:", 'us-east-1');
//console.log("S3_BUCKET_NAME:", 'bucket-mit-cooli-bilder');
//console.log('ESLint: ignoreDuringBuilds:', true);

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  env: {
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_REGION: 'us-east-1',
    S3_BUCKET_NAME: 'bucket-mit-cooli-bilder',
  },
      images: {
        domains: ['bucket-mit-cooli-bilder.s3.us-east-1.amazonaws.com'],
      },
};

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
