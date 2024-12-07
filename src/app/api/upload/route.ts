import { NextRequest, NextResponse } from 'next/server';          //Next.js-Utilities, die HTTP-Anfragen und -Antworten repräsentieren
import 'dotenv/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';  //Kommunikation mit S3 
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';        //Zugriff DynamoDBClient
import { PutCommand } from '@aws-sdk/lib-dynamodb';               //Zugriff DynamoDBClient
import bcrypt from 'bcryptjs';                                    // um PW sicher zu hashen

//Debugging-Logs zur Überprüfung, ob die Credentials Variablen aus .env Datei geladen werden
console.log("AWS_ACCESS_KEY_ID:", process.env.aws_access_key_id);
console.log("AWS_SECRET_ACCESS_KEY:", process.env.aws_secret_access_key);
console.log("AWS_SESSION_TOKEN:", process.env.aws_session_token);


//Initialisierung des AWS-Clients, S3- und DynamoDBClient wird erstellt
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


//Verarbeitung der POST-Anfrage
export async function POST(req: NextRequest) {
  const { file, password } = await req.json();           //Die Anfrage enhält  file (base64-format) und PW
  const imageId = Date.now().toString();                 //Unique ID erstellen, um das Bild eindeutig zu indentifizieren
  const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const uniqueId = `${imageId}${randomString}`;
  const hashedPassword = bcrypt.hashSync(password, 10);  //Bild wir mir gehasht, bevor es gespeichert wird

  try {
    // Hochladeparameter definieren
    const uploadParams = {
      Bucket: 'bucket-mit-cooli-bilder'!,                 // Bucket definieren, in welchen die Bilder hochgeladen werden sollten
      Key: `${imageId}.jpg`,                              // Die zuvor definierte unique Image ID
      Body: Buffer.from(file, 'base64'),
      ContentType: 'image/jpeg',      
    };
    const uploadResult = await s3.send(new PutObjectCommand(uploadParams)); //Hochladen der Datei
    console.log("Upload-Ergebnis:", uploadResult);                          // Log des Ergebnisobjekt

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
    console.log("DynamoDB Eintrag:", JSON.stringify(dbParams, null, 2));

    await dynamoDb.send(new PutCommand(dbParams));           //Daten speichern
    console.log("Datenbank erfolgreich aktualisiert.");      //Erfolgs- oder Fehlermeldung

    // Generierter Link für den Benutzer
    const host = req.headers.get('host') || process.env.HOST_URL;  
    const generatedLink = `${host}/${imageId}`;

    return NextResponse.json({ message: 'Bild hochgeladen', link: generatedLink });
  } catch (error) {
    console.error("Fehler beim Speichern in DynamoDB:", error);
    return NextResponse.json({ message: 'Fehler beim Speichern in DynamoDB', error }, { status: 500 });
  }
}
