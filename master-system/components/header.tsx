"use client";

import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-slate-800 text-white p-4 shadow-lg sticky top-0 z-50">
      <nav className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold hover:text-blue-300 transition-colors">
          FlexiSpace
        </Link>
        <div className="space-x-4 flex items-center">
          <Link 
            href="/MainDashboard" 
            className={`px-4 py-2 rounded-md transition-colors ${
              pathname === '/main-dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            href="/desk-management" 
            className={`px-4 py-2 rounded-md transition-colors ${
              pathname === '/desk-management'
                ? 'bg-green-600 text-white'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            Desks
          </Link>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-white text-slate-800 rounded-md hover:bg-gray-100 transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton 
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
}
