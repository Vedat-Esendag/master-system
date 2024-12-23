"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export function Header() {
  return (
    <header className="bg-slate-800 p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="text-white text-xl font-semibold">
          FlexiSpace
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/Dashboard" 
            className="text-white bg-[#4c82f6] px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Dashboard
          </Link>
          <Link 
            href="/Desks" 
            className="text-white bg-[#4ade80] px-4 py-2 rounded-md hover:bg-green-600"
          >
            Desks
          </Link>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton afterSignOutUrl="/"/>
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
