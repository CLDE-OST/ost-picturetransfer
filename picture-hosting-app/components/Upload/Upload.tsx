import {Card, CardHeader, CardBody, CardFooter, Divider, Link, Image} from "@nextui-org/react";
import React, { useState } from 'react';
import { Input } from '@nextui-org/react';
import { Tooltip } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import axios from 'axios';
import { Snippet } from '@nextui-org/react';

export default function App() {

  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [uploadLink, setUploadLink] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleUpload = async () => {
    if (file && password) {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        try {
          const response = await axios.post('/api/upload', { file: base64, password });
          console.log("Upload erfolgreich:", response.data);
          setUploadLink(response.data.link); // Generierten Link speichern
          setErrorMessage(''); // Fehler zurücksetzen, falls der Upload erfolgreich war
        } catch (error: any) {
          console.error("Fehler beim Upload:", error);
          setErrorMessage(error.response?.data?.message || 'Fehler beim Upload');
        }
      };
      reader.readAsDataURL(file);
    } else {
      setErrorMessage('Bitte Datei und Passwort eingeben.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
  <Card className="max-w-md w-full shadow-sm border border-neutral-700 shadow-neutral-800 bg-neutral-800">
    <CardHeader className="flex flex-col">
      <p>Upload your Picture</p>
    </CardHeader>
    <Divider />
    <CardBody>
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
    </CardBody>
    <Divider />
    <CardBody>
      <Tooltip content="Protect your picture with a password">
        <Input color="primary" type="password" placeholder="Passwort" onChange={(e) => setPassword(e.target.value)} />
      </Tooltip>
    </CardBody>
    <Divider />
    <CardBody>
      <Button onClick={handleUpload} color="primary">Bild hochladen</Button>
    </CardBody>
    <Divider />
    </Card>
    {(errorMessage || uploadLink) && (
      <div className="max-w-md w-full mt-4">
            {errorMessage && (
            <div>
              <Snippet hideSymbol hideCopyButton color="warning">{errorMessage}</Snippet>
            </div>
            )}
            {uploadLink && (
            <div>
              <Snippet hideSymbol color="success">{uploadLink}</Snippet>
            </div>
            )}
      </div>
    )}
</div>
  );
}