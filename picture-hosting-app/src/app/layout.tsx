import type { Metadata } from "next";
import "./globals.css";
import * as React from "react";
import {Providers} from "./provider";

export const metadata: Metadata = {
  title: "picture hOST",
  description: "made with ALOT of pain",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
  return (
    <html lang="en" className='dark'>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}