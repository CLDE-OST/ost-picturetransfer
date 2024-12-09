"use client";
import React, { useState, use } from 'react';
import axios from 'axios';
import { Image } from '@nextui-org/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Snippet } from '@nextui-org/react';
import { Loader2 } from 'lucide-react';

export default function ViewImage({ params }: { params: Promise<{ imageId: string }> }) {
  const { imageId } = use(params);
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Ladezustand

  const handleView = async () => {
    setIsLoading(true); // Ladezustand aktivieren
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
    } finally {
      setIsLoading(false); // Ladezustand deaktivieren
    }
  };

  return (
    <main className="justify-items-center flex-col">
      <section className="flex-1 space-y-12 py-24 px-4 h-[80vh] place-content-center">
        {imageUrl ? (
          <Image  isBlurred height={700} src={imageUrl} alt="Angezeigtes Bild" />
        ) : (
          <div className="container flex flex-col items-center text-center space-y-4 mx-auto">
            {errorMessage && (
              <Snippet hideCopyButton hideSymbol color="danger">
                {errorMessage}
              </Snippet>
            )}
            <Input
            className='hover:bg-neutral-950'
              color="default"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button color="secondary" className='bg-white' onClick={handleView} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Loading
                </>
              ) : (
                "Show picture"
              )}
            </Button>
          </div>
        )}
      </section>
    </main>
  );
}