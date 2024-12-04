import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/header";
import RootLayoutClient from "@/components/root-layout-client";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FlexiSpace - Workspace Management",
  description: "Your all-in-one solution for managing and customizing your workspace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <html lang="en">
        <body className={inter.className}>
          <RootLayoutClient>
            {children}
          </RootLayoutClient>
        </body>
      </html>
    </ClerkProvider>
  );
}
