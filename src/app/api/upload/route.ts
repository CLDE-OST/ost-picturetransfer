import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PutCommand } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';
import { loadSecrets } from '../../../../loadSecrets'; // Stelle sicher, dass der Pfad zur loadSecrets.ts-Datei korrekt ist

// Secrets laden
const secrets = loadSecrets();

//Initialisierung des AWS-Clients, S3- und DynamoDBClient wird erstellt
const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: secrets.AWS_ACCESS_KEY_ID,
    secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY,
    sessionToken: secrets.AWS_SESSION_TOKEN,
  },
});

const dynamoDb = new DynamoDBClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: secrets.AWS_ACCESS_KEY_ID,
    secretAccessKey: secrets.AWS_SECRET_ACCESS_KEY,
    sessionToken: secrets.AWS_SESSION_TOKEN,
  },
});

//Verarbeitung der POST-Anfrage
export async function POST(req: NextRequest) {
  const { file, password } = await req.json(); // Die Anfrage enhält file (base64-format) und PW
  const imageId = Date.now().toString(); // Unique ID erstellen, um das Bild eindeutig zu identifizieren
  const hashedPassword = bcrypt.hashSync(password, 10); // Passwort wird gehasht

  try {
    // Hochladeparameter definieren
    const uploadParams = {
      Bucket: 'bucket-mit-cooli-bilder', // Bucket definieren, in welchen die Bilder hochgeladen werden sollten
      Key: `${imageId}.jpg`, // Die zuvor definierte unique Image ID
      Body: Buffer.from(file, 'base64'),
      ContentType: 'image/jpeg',
    };
    const uploadResult = await s3.send(new PutObjectCommand(uploadParams)); // Hochladen der Datei
    console.log('Upload-Ergebnis:', uploadResult);

    // Metadaten in DynamoDB speichern, Daten für die Datenbank vorbereiten
    const dbParams = {
      TableName: 'images', // Sicherstellen, dass der Tabellenname korrekt ist
      Item: {
        imageID: imageId, // Partition Key: muss genau so benannt werden
        imageUrl: `https://bucket-mit-cooli-bilder.s3.us-east-1.amazonaws.com/${imageId}.jpg`,
        hashedPassword,
        uploadDate: new Date().toISOString(),
      },
    };
    console.log('DynamoDB Eintrag:', JSON.stringify(dbParams, null, 2));

    await dynamoDb.send(new PutCommand(dbParams)); // Daten speichern
    console.log('Datenbank erfolgreich aktualisiert.');

    // Generierter Link für den Benutzer
    const host = req.headers.get('host') || 'http://localhost:3000';
    const generatedLink = `${host}/${imageId}`;

    return NextResponse.json({ message: 'Bild hochgeladen', link: generatedLink });
  } catch (error) {
    console.error('Fehler beim Speichern in DynamoDB:', error);
    return NextResponse.json({ message: 'Fehler beim Speichern in DynamoDB', error }, { status: 500 });
  }
}
