import {Card, CardHeader, CardBody, Divider, CardFooter} from "@nextui-org/react";
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
        } catch (error: unknown) {
          console.error("Fehler beim Upload:", error);
          if (axios.isAxiosError(error)) {
            setErrorMessage(error.response?.data?.message || 'Fehler beim Upload');
          } else {
            setErrorMessage('Unbekannter Fehler beim Upload');
          }
        }
      };
      reader.readAsDataURL(file);
    } else {
      setErrorMessage('Bitte Datei und Passwort eingeben.');
    }
  };

  return (
    <div className="grid grid-cols-12 gap-5">
  <Card className="col-start-5 col-end-9 shadow-sm border border-neutral-700 shadow-neutral-800 bg-neutral-700">
    <CardHeader className="flex flex-col">
      <p>Upload your Picture</p>
    </CardHeader>
    <Divider />
    <CardBody className="flex flex-col">
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
    </CardBody>
    <Divider />
    <CardBody className="flex flex-col">
      <Tooltip content="Protect your picture with a password">
        <Input color="default" type="password" placeholder="Passwort" onChange={(e) => setPassword(e.target.value)} />
      </Tooltip>
    </CardBody>
    <Divider />
    <CardFooter className="flex flex-col">
      <Button onClick={handleUpload} color="primary">Bild hochladen</Button>
      {(errorMessage || uploadLink) && (
      <div className="mt-4">
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
    </CardFooter>

    </Card>
    
</div>
  );
}