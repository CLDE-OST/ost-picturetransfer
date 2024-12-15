import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { sdkStreamMixin } from '@aws-sdk/util-stream-node';

export async function POST(req: NextRequest) {
  const { imageId, password } = await req.json();

  try {
    const dynamoDb = new DynamoDBClient({ region: 'us-east-1' });
    const dbParams = {
      TableName: 'imghost-pictures',
      Key: { imageID: imageId },
    };
    const data = await dynamoDb.send(new GetCommand(dbParams));

    if (!data.Item) {
      return NextResponse.json({ message: 'Image not found or has already been deleted.' }, { status: 404 });
    }

    const isPasswordValid = bcrypt.compareSync(password, data.Item.hashedPassword);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Wrong Passwort' }, { status: 401 });
    }

    const s3 = new S3Client({ region: 'us-east-1' });
    const command = new GetObjectCommand({
      Bucket: 'imghost-pictures-database',
      Key: data.Item.s3Key,
    });
    const s3Response = await s3.send(command);

    // Mixin anwenden, um den Stream asynchron iterierbar zu machen
    const mixedStream = sdkStreamMixin(s3Response.Body);
    const chunks = [];
    for await (const chunk of mixedStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    const headers = new Headers();
    headers.set('Content-Type', 'image/jpeg');

    return new NextResponse(buffer, { status: 200, headers });
  } catch (error) {
    console.error('Error when retrieving the image:', error);
    return NextResponse.json({ message: 'Error when retrieving the image:', error }, { status: 500 });
  }
}