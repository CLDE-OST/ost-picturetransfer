import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    sessionToken: process.env.AWS_SESSION_TOKEN!,
  },
});

const dynamoDb = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    sessionToken: process.env.AWS_SESSION_TOKEN!,
  },
});

export async function POST(req: NextRequest) {
  const { file, password } = await req.json();
  const imageId = Date.now().toString();
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    // Bild in S3 hochladen
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `${imageId}.jpg`,
      Body: Buffer.from(file, 'base64'),
      ContentType: 'image/jpeg',
    };
    const uploadResult = await s3.send(new PutObjectCommand(uploadParams));
    console.log("Upload-Ergebnis:", uploadResult);

    // Debugging-Logs zur Verfolgung
    console.log("========== DEBUGGING START ==========");
    console.log("AWS Region:", process.env.AWS_REGION);
    console.log("S3 Bucket Name:", process.env.S3_BUCKET_NAME);
    console.log("Image ID:", imageId);
    console.log("Hashed Password:", hashedPassword);
    console.log("Image URL:", `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageId}.jpg`);
    console.log("========== DEBUGGING END ==========");

    // Daten in DynamoDB speichern
    const dbParams = {
      TableName: 'images', // Sicherstellen, dass der Tabellenname korrekt ist
      Item: {
        imageID: imageId, // Partition Key: muss genau so benannt werden
        imageUrl: `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${imageId}.jpg`,
        hashedPassword,
        uploadDate: new Date().toISOString(),
      },
    };
    console.log("DynamoDB Eintrag:", JSON.stringify(dbParams, null, 2));

    await dynamoDb.send(new PutCommand(dbParams));
    console.log("Datenbank erfolgreich aktualisiert.");

    // Generierter Link für den Benutzer
    const host = req.headers.get('host') || process.env.HOST_URL;
    const generatedLink = `${host}/${imageId}`;

    return NextResponse.json({ message: 'Bild hochgeladen', link: generatedLink });
  } catch (error) {
    console.error("Fehler beim Speichern in DynamoDB:", error);
    return NextResponse.json({ message: 'Fehler beim Speichern in DynamoDB', error }, { status: 500 });
  }
}