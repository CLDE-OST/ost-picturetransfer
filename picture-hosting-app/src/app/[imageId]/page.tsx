"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { use } from 'react';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';

export default function ViewImage({ params }: { params: Promise<{ imageId: string }> }) {
  const { imageId } = use(params); // Entpacke das Promise mit React.use()

  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleView = async () => {
    try {
      const response = await axios.post('/api/view', { imageId, password });
      setImageUrl(response.data.imageUrl);
      setErrorMessage('');
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Fehler beim Abrufen des Bildes');
    }
  };

  return (
    <div>
      <Header />
      <h2>Bild anzeigen</h2>
      <input 
        type="password" 
        placeholder="Passwort eingeben" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button onClick={handleView}>Bild anzeigen</button>

      {errorMessage && <p>{errorMessage}</p>}

      {imageUrl && (
        <div>
          <h3>Bild:</h3>
          <img src={imageUrl} alt="Angezeigtes Bild" />
        </div>
      )}

      <Footer />
    </div>
  );
}