"use client";
import React, { useState } from 'react';
import axios from 'axios';
import { use } from 'react';
import Header from '../../../components/Header/Header';
import Footer from '../../../components/Footer/Footer';
import { Image } from '@nextui-org/image';
import { Input } from '@nextui-org/react';
import { Button } from '@nextui-org/react';
import { Snippet } from '@nextui-org/react';

export default function ViewImage({ params }: { params: Promise<{ imageId: string }> }) {
  const { imageId } = use(params); // Entpacke das Promise mit React.use()

  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleView = async () => {
    try {
      const response = await axios.post("/api/view", { imageId, password });
      setImageUrl(response.data.imageUrl);
      setErrorMessage("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
      setErrorMessage(
        error.response?.data?.message || "Fehler beim Abrufen des Bildes"
      );
      } else {
      setErrorMessage("Ein unbekannter Fehler ist aufgetreten");
      }
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-950">
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-800 opacity-30 rounded-full blur-3xl animate-bubble-1"></div>
      <div className="absolute top-2/3 left-1/3 w-56 h-56 bg-gradient-to-br from-teal-700 via-green-800 to-blue-900 opacity-25 rounded-full blur-3xl animate-bubble-2"></div>
      <div className="absolute top-1/3 left-3/4 w-80 h-80 bg-gradient-to-br from-red-700 via-pink-800 to-purple-900 opacity-20 rounded-full blur-3xl animate-bubble-3"></div>
      <div className="absolute top-1/2 left-1/5 w-64 h-64 bg-gradient-to-br from-blue-800 via-cyan-900 to-teal-700 opacity-20 rounded-full blur-3xl animate-bubble-2"></div>
      <div className="absolute top-1/5 left-2/3 w-48 h-48 bg-gradient-to-br from-purple-800 via-indigo-900 to-blue-700 opacity-30 rounded-full blur-3xl animate-bubble-3"></div>
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex flex-1 flex-col items-center justify-center">
          {imageUrl ? (
            <Image
              height={700}
              src={imageUrl}
              alt="Angezeigtes Bild"
            />
          ) : (
            <>
            {errorMessage && <Snippet hideCopyButton hideSymbol color="danger" >{errorMessage}</Snippet>}
              <Input variant="bordered" className="m-4 w-50"
                type="password"
                placeholder="Passwort eingeben"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button color="secondary" onClick={handleView}>Bild anzeigen</Button>
              
            </>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}