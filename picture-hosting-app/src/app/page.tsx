"use client";
import Upload from "../../components/Upload/Upload";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";


export default function Home() {
    return (
  <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-950 flex flex-col justify-between">
    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-indigo-700 via-purple-700 to-blue-800 opacity-10 rounded-full blur-3xl animate-bubble-1"></div>
    <div className="absolute top-2/3 left-1/3 w-96 h-96 bg-gradient-to-br from-teal-700 via-green-800 to-blue-900 opacity-10 rounded-full blur-3xl animate-bubble-2"></div>
    <div className="absolute top-1/3 left-3/4 w-96 h-96 bg-gradient-to-br from-red-700 via-pink-800 to-purple-900 opacity-10 rounded-full blur-3xl animate-bubble-3"></div>
    <div className="absolute top-1/2 left-1/5 w-96 h-96 bg-gradient-to-br from-blue-800 via-cyan-900 to-teal-700 opacity-10 rounded-full blur-3xl animate-bubble-2"></div>
    <div className="absolute top-1/5 left-2/3 w-96 h-96 bg-gradient-to-br from-purple-800 via-indigo-900 to-blue-700 opacity-10 rounded-full blur-3xl animate-bubble-3"></div>
    <Header />
    <main>
      <Upload />
    </main>
    <Footer />
  </div>
  );
}