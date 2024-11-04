"use client";

import {Navbar} from "@nextui-org/react";
import Image from "next/image";

export default function Header() {
  return (
    <div className="grid grid-cols-12">
  <Navbar className="p-2 my-4 col-start-6 col-end-8 rounded-xl shadow-sm border border-neutral-700 shadow-neutral-800 bg-neutral-800">
    <Image width={50} height={50} src="/logo.png" alt="hOST" className="mx-auto" />
  </Navbar>
</div>
  );
}