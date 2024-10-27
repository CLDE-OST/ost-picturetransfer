import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';

const dynamoDb = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    sessionToken: process.env.AWS_SESSION_TOKEN!,
  },
});

export async function POST(req: NextRequest) {
  const { imageId, password } = await req.json();

  try {
    // Daten aus DynamoDB abrufen
    const dbParams = {
      TableName: 'images',
      Key: {
        imageID: imageId, // Der Primärschlüssel
      },
    };

    const data = await dynamoDb.send(new GetCommand(dbParams));

    if (!data.Item) {
      return NextResponse.json({ message: 'Bild nicht gefunden' }, { status: 404 });
    }

    // Passwort überprüfen
    const isPasswordValid = bcrypt.compareSync(password, data.Item.hashedPassword);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Falsches Passwort' }, { status: 401 });
    }

    // Erfolgreich: Image URL zurückgeben
    return NextResponse.json({ imageUrl: data.Item.imageUrl });
  } catch (error) {
    console.error("Fehler beim Abrufen des Bildes:", error);
    return NextResponse.json({ message: 'Fehler beim Abrufen des Bildes', error }, { status: 500 });
  }
}