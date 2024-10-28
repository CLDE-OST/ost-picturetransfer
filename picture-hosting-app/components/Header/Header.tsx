"use client";

import {Navbar} from "@nextui-org/react";
import Image from 'next/image';

export default function Header() {
  return (
    <div className="grid grid-cols-5 sticky top-0">
      <div className="col-span-1"/>
      <Navbar className="col-span-3 m-2 items-center rounded-xl shadow-sm border border-neutral-700 shadow-neutral-800 bg-neutral-800">
      <p className="font-bold text-inherit">hOST</p>
          <Image width={100} height={50} src="/ost_logo.png" alt="hOST" className="h-8 w-auto"/>

      </Navbar>
      <div className="col-span-1"/>
    </div>
  );
}