"use client";
import Upload from "@/components/Upload";
import WordPullUp from "@/components/ui/word-pull-up";
import { FadeText } from "@/components/ui/fade-text";
import AnimatedShinyText from "@/components/ui/animated-shiny-text";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <main className="flex flex-col h-screen">
      <section className="flex-1 space-y-12 px-4 flex flex-col py-20">
        <div className="container flex flex-col items-center text-center space-y-4 mx-auto">
          <WordPullUp
            className="text-6xl font-bold text-white"
            words="Upload Your Images with Ease"
          />

          <FadeText
            className="max-w-[600px] text-muted-foreground md:text-xl/relaxed"
            text="The fastest and most secure way to share your images. Drag, drop, and share in seconds."
          />
              <motion.div
                initial={{ y: 0, scale: 0.4, opacity: 0 }}
                animate={{ y: 0, scale: 1, opacity: 1 }}
                transition={{ ease: "circInOut", duration: 1.25 }}
              >   
          <div className="z-10 flex items-center justify-center">
            <div
              className={cn(
                "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
              )}
            >
            </div>
          </div>
          </motion.div>   
        </div>
        <Upload />
      </section>
    </main>
  );
}
