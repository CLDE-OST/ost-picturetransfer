"use client";
import Upload from "@/components/Upload";
import WordPullUp from "@/components/ui/word-pull-up";
import { FadeText } from "@/components/ui/fade-text";

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <section className="flex-1 space-y-12 px-4 flex flex-col py-24">
        <div className="container flex flex-col items-center text-center space-y-4 mx-auto">
          <WordPullUp
            className="text-4xl font-bold tracking-[-0.02em] text-white md:text-7xl md:leading-[5rem]"
            words="Upload Your Images with Ease"
          />

          <FadeText
            className="max-w-[600px] text-muted-foreground md:text-xl/relaxed"
            text="The fastest and most secure way to share your images. Drag, drop, and share in seconds."
          />
          
        </div>
        <Upload />
      </section>
    </main>
  );
}
