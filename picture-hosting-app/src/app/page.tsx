"use client";

import React, { useState } from 'react';
import axios from 'axios';

export default function Home() {
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
    <div>
      <h2>Bild hochladen</h2>
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files?.[0] || null)} 
      />
      <input 
        type="password" 
        placeholder="Passwort" 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleUpload}>Bild hochladen</button>

      {/* Fehlernachrichten anzeigen */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      {/* Generierten Link anzeigen */}
      {uploadLink && (
        <div>
          <p>Upload erfolgreich! Du kannst das Bild hier ansehen:</p>
          <a href={uploadLink} target="_blank" rel="noopener noreferrer">
            {uploadLink}
          </a>
        </div>
      )}
    </div>
  );
}