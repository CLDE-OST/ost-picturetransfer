import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';

function generateImageId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomPart = '';
  for (let i = 0; i < 8; i++) {
    randomPart += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  const timestamp = Date.now();
  const randomNumber = Math.floor(Math.random() * 1000000);
  return `${randomNumber}${randomPart}${timestamp}`;
}

export async function POST(req: NextRequest) {
  const { file, password } = await req.json();

  const imageId = generateImageId();
  console.log('Generated Image ID:', imageId);

  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    const s3 = new S3Client({ region: 'us-east-1' });
    const uploadParams = {
      Bucket: 'bucket-mit-cooli-bilder',
      Key: `${imageId}.jpg`,
      Body: Buffer.from(file, 'base64'),
      ContentType: 'image/jpeg',
    };
    await s3.send(new PutObjectCommand(uploadParams));

    const dynamoDb = new DynamoDBClient({ region: 'us-east-1' });
    const dbParams = {
      TableName: 'images',
      Item: {
        imageID: imageId,
        hashedPassword,
        s3Key: `${imageId}.jpg` // Hier speicherst du den Key, statt einer URL
      },
    };
    await dynamoDb.send(new PutCommand(dbParams));

    const host = req.headers.get('host') || 'http://localhost:3000';
    const generatedLink = `${host}/${imageId}`;
    return NextResponse.json({ message: 'Image uploaded', link: generatedLink });
  } catch (error) {
    console.error('Error during upload:', error);
    return NextResponse.json({ message: 'Error during upload', error }, { status: 500 });
  }
}