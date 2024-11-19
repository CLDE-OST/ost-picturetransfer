This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Requirements
- AWS Account
- SSH Client (Mac/Windows)

NOTE: Everything was performed on a MacOS, so some steps may be a bit different.

## Preparation
1. Create a new Repo and clone this repo to the new created one.
1. Login to your AWS Console
2. Create a EC2 Instance (Ubuntu/x86)
3. Create a DynamoDB
4. Create a S3 Bucket

## Installation
1. Clone your Repo on your local machine ```git clone your.repo```
2. Navigate to ost-picturetransfer/src/app/upload and open ```route.ts```
### ost-picturetransfer/src/app/upload/route.ts
Change on every line region, bucket, tablename accordingly to your bucket, dynamodb created on the AWS.
1. On line 8 and 17 change   `region: 'us-east-1'`
2. On line 33 change `Bucket: 'bucket-mit-cooli-bilder'!,`
3. On line 43 change `TableName: 'images',`
4. On line imageUrl: `imageUrl: 'https://bucket-mit-cooli-bilder.s3.us-east-1.amazonaws.com/${imageId}.jpg',`

3. Navigate to ost-picturetransfer/src/app/view and open ```route.ts```
### ost-picturetransfer/src/app/view/route.ts
1. On line 7 change `region: 'us-east-1',`
2. On line 21 change `TableName: 'images',`

6. Git commit the changes to your repo.
7. Connect to your EC2 Instance via SSH
8. Connected to your instance `sudo apt install` and `sudo apt update` then `sudo apt install npm`
9. Git clone your repo ```git clone your.repo```
10. Navigate ```cd ost-picturetransfer```
11. Inside ```npm install```
12. After ```npm run build```
13. Navigate to .next folder ```cd .next```
14. Create a .env file with: ```touch .env```
15. Open the .env file ```nano .env```
16. Paste your credentials from AWS in to the .env file without the ```[default]``` tag
17. cd back ```cd```
18. npm start

Server should be available on the port ```:3000```
