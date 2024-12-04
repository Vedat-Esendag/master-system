"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-slate-800 text-white p-4 shadow-lg sticky top-0 z-50">
      <nav className="max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex-1 text-xl font-bold tracking-wide">
          FlexiSpace
        </div>
        <div className="flex items-center gap-4">
          <Link 
            href="/Dashboard" 
            className={`px-4 py-2 rounded-md transition-colors ${
              pathname === '/Dashboard'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            href="/Desks" 
            className={`px-4 py-2 rounded-md transition-colors ${
              pathname === '/Desks'
                ? 'bg-green-600 text-white'
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            Desks
          </Link>
        </div>
      </nav>
    </header>
  );
}
