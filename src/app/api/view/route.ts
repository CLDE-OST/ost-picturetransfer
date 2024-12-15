import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  // Unterdrücke externe Ressourcenaufrufe während des Builds
  //if (process.env.NODE_ENV !== 'production') {
  //  console.log('Build/Entwicklungsmodus: Externe Aufrufe werden übersprungen.');
  //  return NextResponse.json({ message: 'Build/Entwicklung: Externe Aufrufe übersprungen' });
  //}

  const { imageId, password } = await req.json(); // Anfrage-Daten

  try {
    // AWS-DynamoDB-Client initialisieren
    const dynamoDb = new DynamoDBClient({ region: 'us-east-1' });
    const dbParams = {
      TableName: 'images',
      Key: {
        imageID: imageId,
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

    // Erfolgreich: Bild-URL zurückgeben
    return NextResponse.json({ imageUrl: data.Item.imageUrl });
  } catch (error) {
    console.error('Fehler beim Abrufen des Bildes:', error);
    return NextResponse.json({ message: 'Fehler beim Abrufen des Bildes', error }, { status: 500 });
  }
}