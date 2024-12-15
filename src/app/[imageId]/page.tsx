"use client";
import React, { useState, use } from 'react';
import axios from 'axios';
import { Image } from '@nextui-org/image';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from "@/components/ui/badge"

export default function ViewImage({ params }: { params: Promise<{ imageId: string }> }) {
  const { imageId } = use(params);
  const [password, setPassword] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleView = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        "/api/view",
        { imageId, password },
        { responseType: 'arraybuffer' } // Wichtig: Binäre Daten anfordern
      );

      // Blob aus dem ArrayBuffer erstellen
      const blob = new Blob([response.data], { type: 'image/jpeg' });
      const url = URL.createObjectURL(blob);
      
      setImageUrl(url);
      setErrorMessage("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || "Error when retrieving the image");
      } else {
        setErrorMessage("An unknown error has occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="justify-items-center flex-col">
      <section className="flex-1 space-y-12 py-24 px-4 h-[80vh] place-content-center">
        {imageUrl ? (
          <motion.div
            initial={{ y: 0, scale: 0, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ ease: "circInOut", duration: 0.3 }}
            className='-mt-10'
          >
            <Image isBlurred height={700} src={imageUrl} alt="Displayed image" />
          </motion.div>
        ) : (
          <div className="container flex flex-col items-center text-center space-y-4 mx-auto">
            {errorMessage && (
              <Badge variant="destructive">
                {errorMessage}
              </Badge>
            )}
            <Input
              className='hover:bg-neutral-950'
              color="default"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button 
              color="secondary"
              className='bg-white'
              onClick={handleView}
              disabled={isLoading}
            >
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