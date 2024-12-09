import { Card, CardTitle, CardHeader, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Tooltip } from '@nextui-org/react';
import { Button } from "@/components/ui/button";
import axios from 'axios';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, Clipboard, Loader2 } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function App() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [uploadLink, setUploadLink] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Ladezustand

  const handleUpload = async () => {
    if (file && password) {
      setIsLoading(true); // Ladezustand aktivieren
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
        } finally {
          setIsLoading(false); // Ladezustand deaktivieren
        }
      };
      reader.readAsDataURL(file);
    } else {
      setErrorMessage('Bitte Datei und Passwort eingeben.');
    }
  };

  return (
    <div className="mx-auto container w-[45%]">
      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Upload your Image</CardTitle>
          <CardDescription>Supported are only imagefiles up to 2MB</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {!uploadLink && (
            <>
              <div className="grid w-full max-w items-center gap-1.5">
                <Input
                  id="picture"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] || null;
                    if (selectedFile) {
                      if (selectedFile.size > 2 * 1024 * 1024) {
                        setErrorMessage('Die Datei darf maximal 2 MB groß sein.');
                        setFile(null);
                      } else {
                        setErrorMessage('');
                        setFile(selectedFile);
                      }
                    }
                  }}
                />
              </div>
              <Tooltip placement="bottom" content="Protect your picture with a password">
                <Input
                  color="default"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Tooltip>
            </>
          )}
        </CardContent>
        <CardFooter className="flex flex-col">
          {!uploadLink && (
            <Button onClick={handleUpload} color="primary" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Bitte warten
                </>
              ) : (
                "Bild hochladen"
              )}
            </Button>
          )}
          {(errorMessage || uploadLink) && (
            <div className="mt-2 w-full">
              {errorMessage && (
                <div>
                  <Alert className="mt-2 border-red-500 text-red-500">
                    <AlertCircle className="h-fit w-fit stroke-red-500" />
                    <AlertTitle className="ml-2">Error</AlertTitle>
                    <AlertDescription className="ml-2">
                      {errorMessage}
                    </AlertDescription>
                  </Alert>
                </div>
              )}
              {uploadLink && (
                <div>
                  <div className="flex">
                    <Input readOnly value={uploadLink} className="flex-grow" />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          onClick={() => {
                            navigator.clipboard.writeText(uploadLink);
                            setTimeout(() => setErrorMessage(''), 2000);
                          }}
                          className="ml-2"
                        >
                          <Clipboard />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit bg-white text-black">
                        <p>Copied!</p>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}