import type { NextConfig } from "next";
require('dotenv').config();

console.log("AWS_ACCESS_KEY_ID:", process.env.ENV_AWS_ACCESS_KEY_ID);
console.log("AWS_SECRET_ACCESS_KEY:", process.env.ENV_AWS_SECRET_ACCESS_KEY);
console.log("AWS_REGION:", process.env.ENV_AWS_REGION);
console.log("S3_BUCKET_NAME:", process.env.ENV_S3_BUCKET_NAME);

module.exports = {
  basePath: '/picture-hosting-app',
  reactStrictMode: true,
  env: {
    AWS_ACCESS_KEY_ID: process.env.ENV_AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.ENV_AWS_SECRET_ACCESS_KEY,
    AWS_REGION: process.env.ENV_AWS_REGION,
    S3_BUCKET_NAME: process.env.ENV_S3_BUCKET_NAME,
  },
      images: {
        domains: ['bucket-mit-cooli-bilder.s3.us-east-1.amazonaws.com'],
      },
};

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
