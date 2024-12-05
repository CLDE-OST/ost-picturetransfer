import { NextRequest, NextResponse } from 'next/server';
import 'dotenv/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';

//Debugging-Logs zur Überprüfung, ob die Credentials Variablen geladen werden
console.log("AWS_ACCESS_KEY_ID:", process.env.aws_access_key_id);
console.log("AWS_SECRET_ACCESS_KEY:", process.env.aws_secret_access_key);
console.log("AWS_SESSION_TOKEN:", process.env.aws_session_token);


const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.aws_access_key_id!,
    secretAccessKey: process.env.aws_secret_access_key!,
    sessionToken: process.env.aws_session_token!,
  },
});

const dynamoDb = new DynamoDBClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.aws_access_key_id!,
    secretAccessKey: process.env.aws_secret_access_key!,
    sessionToken: process.env.aws_session_token!,
  },
});

export async function POST(req: NextRequest) {
  const { file, password } = await req.json();
  const imageId = Date.now().toString();
  const hashedPassword = bcrypt.hashSync(password, 10);

  try {
    // Bild in S3 hochladen
    const uploadParams = {
      Bucket: 'bucket-mit-cooli-bilder'!,
      Key: `${imageId}.jpg`,
      Body: Buffer.from(file, 'base64'),
      ContentType: 'image/jpeg',
    };
    const uploadResult = await s3.send(new PutObjectCommand(uploadParams));
    console.log("Upload-Ergebnis:", uploadResult);

    // Daten in DynamoDB speichern
    const dbParams = {
      TableName: 'images', // Sicherstellen, dass der Tabellenname korrekt ist
      Item: {
        imageID: imageId, // Partition Key: muss genau so benannt werden
        imageUrl: `https://bucket-mit-cooli-bilder.s3.us-east-1.amazonaws.com/${imageId}.jpg`,
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
