"use client";
import Upload from "@/components/Upload";
import Image from 'next/image';


export default function Home() {
    return (
      <main className="flex min-h-screen flex-col">
                  <header className="top-0 left-0 m-3">
              <Image src="logo.svg" width={32} height={32} alt="Logo"/>
          </header>
      {/* Hero Section */}
      <section className="flex-1 space-y-12 py-12 md:py-24 px-4">
        <div className="container flex flex-col items-center text-center space-y-4 mx-auto">

          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Upload Your Images with Ease
          </h1>
          <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed">
            The fastest and most secure way to share your images.
          </p>
        </div>

        {/* Upload Section */}
        <div className="container mx-auto">
          <Upload />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="flex place-content-center flex-row p-5 gap-5">
          <p className="text-sm text-muted-foreground">
            © 2024 imgHOST. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}