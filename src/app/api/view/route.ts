import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { GetCommand } from '@aws-sdk/lib-dynamodb';
import bcrypt from 'bcryptjs';

const dynamoDb = new DynamoDBClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.aws_access_key_id!,
    secretAccessKey: process.env.aws_secret_access_key!,
    sessionToken: process.env.aws_session_token!,
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
      return NextResponse.json({ message: 'Image not found' }, { status: 404 });
    }

    // Passwort überprüfen
    const isPasswordValid = bcrypt.compareSync(password, data.Item.hashedPassword);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Incorrect password' }, { status: 401 });
    }

    // Erfolgreich: Image URL zurückgeben
    return NextResponse.json({ imageUrl: data.Item.imageUrl });
  } catch (error) {
    console.error("Error when retrieving the image", error);
    return NextResponse.json({ message: 'Error when retrieving the image', error }, { status: 500 });
  }
}