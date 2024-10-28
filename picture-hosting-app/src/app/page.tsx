"use client";
import React, { useState } from 'react';
import Upload from "../../components/Upload/Upload";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";


export default function Home() {
    return (
<div className="min-h-screen flex flex-col">
  <Header />
  <main className="flex-1 flex items-center justify-center">
    <Upload />
  </main>
  <Footer />
</div>
  );
}