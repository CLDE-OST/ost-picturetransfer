This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Requirements
- AWS Account
- SSH Client (Mac/Windows)
- AWS CLI

NOTE: Everything was performed on a MacOS, so some steps may be a bit different.

## Preparation
- Create a S3 Bucket
- Create a DynamoDB (Partition Key should be imageID, the others should be left empty.)
- EC2 Instance

## Installation
1. Login to your EC2 via SSH
2. Clone the repo
3. Navigate to the directory
4. npm install to install dependencies
6. Change the bucket and dynamodb names in route.ts in view and upload
7. Set the tokens via AWSCLI
8. npm build and npm run


