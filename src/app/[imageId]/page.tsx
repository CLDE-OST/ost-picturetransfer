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
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center">
        {imageUrl ? (
          <Image height={700} src={imageUrl} alt="Angezeigtes Bild" />
        ) : (
          <div className="flex flex-col items-center">
            {errorMessage && (
              <Snippet hideCopyButton hideSymbol color="danger">
                {errorMessage}
              </Snippet>
            )}
            <Input
              className="m-4 w-50"
              type="password"
              placeholder="Type in password to decrypt image"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button color="secondary" onClick={handleView} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Loading
                </>
              ) : (
                "Show picture"
              )}
            </Button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="flex place-content-center flex-row p-5 gap-5">
          <p className="text-sm text-muted-foreground">
            © 2024 hOST. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}