import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  // Unterdrücke externe Ressourcenaufrufe während des Builds
  if (process.env.NODE_ENV !== 'production') {
    console.log('Build/Entwicklungsmodus: Externe Aufrufe werden übersprungen.');
    return NextResponse.json({ message: 'Build/Entwicklung: Externe Aufrufe übersprungen' });
  }

  const { file, password } = await req.json(); // Anfrage-Daten
  const imageId = Date.now().toString(); // Unique ID für das Bild
  const hashedPassword = bcrypt.hashSync(password, 10); // Passwort hash-en

  try {
    // AWS-S3-Client initialisieren
    const s3 = new S3Client({ region: 'us-east-1' });
    const uploadParams = {
      Bucket: 'bucket-mit-cooli-bilder',
      Key: `${imageId}.jpg`,
      Body: Buffer.from(file, 'base64'),
      ContentType: 'image/jpeg',
    };
    await s3.send(new PutObjectCommand(uploadParams));

    // AWS-DynamoDB-Client initialisieren
    const dynamoDb = new DynamoDBClient({ region: 'us-east-1' });
    const dbParams = {
      TableName: 'images',
      Item: {
        imageID: imageId,
        imageUrl: `https://bucket-mit-cooli-bilder.s3.us-east-1.amazonaws.com/${imageId}.jpg`,
        hashedPassword,
        uploadDate: new Date().toISOString(),
      },
    };
    await dynamoDb.send(new PutCommand(dbParams));

    // Erfolgreiche Rückmeldung
    const host = req.headers.get('host') || 'http://localhost:3000';
    const generatedLink = `${host}/${imageId}`;
    return NextResponse.json({ message: 'Bild hochgeladen', link: generatedLink });
  } catch (error) {
    console.error('Fehler beim Upload:', error);
    return NextResponse.json({ message: 'Fehler beim Upload', error }, { status: 500 });
  }
}

