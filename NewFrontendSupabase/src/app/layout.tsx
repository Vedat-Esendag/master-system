'use client'

import './globals.css'
import { ClerkProvider, SignIn, SignedIn, SignedOut, UserButton, RedirectToSignIn } from '@clerk/nextjs'
import { Providers } from './providers'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <SignedOut>
            {/* Redirect to Clerk's default sign-in page */}
            <RedirectToSignIn />
          </SignedOut>
          <SignedIn>
            <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', alignItems: 'center' }}>
              <UserButton />
            </header>
            <Providers>{children}</Providers>
          </SignedIn>
        </body>
      </html>
    </ClerkProvider>
  )
}
