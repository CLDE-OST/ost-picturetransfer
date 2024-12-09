"use client";
import Upload from "@/components/Upload";
import { Cloud } from "lucide-react"


export default function Home() {
    return (
      <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex-1 space-y-12 py-12 md:py-24 px-4">
        <div className="container flex flex-col items-center text-center space-y-4 mx-auto">
          <div className="rounded-full bg-primary/10 p-4 mb-4">
            <Cloud fill="white" className="h-8 w-8" />
          </div>
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
            © 2024 hOST. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}