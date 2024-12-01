"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="bg-slate-800 text-white p-4 shadow-lg">
      <nav className="max-w-5xl mx-auto flex items-center justify-between">
        <h1 className="text-xl font-bold">FlexiSpace</h1>
        <div className="space-x-4">
          <Link 
            href="/MainDashboard" 
            className="px-4 py-2 bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
          >
            Main Dashboard
          </Link>
          <Link 
            href="/desk-management" 
            className="px-4 py-2 bg-green-500 rounded-md hover:bg-green-600 transition-colors"
          >
            Desk Management
          </Link>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
