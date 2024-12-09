import type { Metadata } from "next";
import "./globals.css";
import * as React from "react";
import { Providers } from "./provider";
import AnimatedGridPattern from "@/components/ui/animated-grid-pattern";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "imgHOST",
  description: "made with ALOT of pain",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="overflow-hidden z-10">
        <header className="p-3">
          <Link href="/">
            <Image src="logo.svg" width={32} height={32} alt="Logo" />
          </Link>
        </header>

        <AnimatedGridPattern
          numSquares={40}
          maxOpacity={0.5}
          duration={2}
          repeatDelay={0.5}
          className={cn(
            "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
            "h-full skew-y-12 -z-10"
          )}
        />
        <Providers>
         {children}
        </Providers>
        <footer className="z-10 bottom-0 w-full absolute justify-items-center p-3">
            <p className="text-sm text-muted-foreground">
              © 2024 imgHOST. All rights reserved.
            </p>
        </footer>
      </body>
    </html>
  );
}