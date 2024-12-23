"use client";

import { RedirectToSignIn, useUser, useAuth } from '@clerk/nextjs';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeUserData = async () => {
      try {
        if (!user?.id) {
          console.log('No user ID available');
          return;
        }

        // Get JWT token from Clerk
        const token = await getToken({ template: "supabase" });
        if (!token) {
          console.error('Failed to get Supabase token from Clerk');
          return;
        }

        // Initialize Supabase client with the token
        const supabase = createClientComponentClient();
        
        // Test connection first
        const { data: connectionTest, error: connectionError } = await supabase
          .from('users')
          .select('count')
          .limit(1);
        
        console.log('Connection test:', { connectionTest, connectionError });

        // Check if user exists
        const { data: existingData, error: checkError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', user.id);

        if (checkError) {
          console.error('Error checking user data:', checkError);
          setError(checkError.message);
          return;
        }

        // If user doesn't exist, create them
        if (!existingData || existingData.length === 0) {
          const { error: insertError } = await supabase
            .from('users')
            .insert([{
              user_id: user.id,
              email: user.emailAddresses[0]?.emailAddress || '',
              created_at: new Date().toISOString()
            }]);

          if (insertError) {
            console.error('Error creating user:', insertError);
            setError(insertError.message);
            return;
          }
        }

        console.log('User data initialized successfully');

      } catch (err) {
        console.error('Unexpected error:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      }
    };

    if (user) {
      initializeUserData();
    }
  }, [user, getToken]);

  if (!isLoaded || !user) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome to FlexiSpace</h2>
        <p className="text-gray-600 text-lg mb-8">
          Your all-in-one solution for managing and customizing your workspace. Navigate to the Main Dashboard to view
          your data or use the Customize Table feature to tailor your tables according to your needs.
        </p>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Link href="/Dashboard">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Main Dashboard</h3>
              <p className="text-gray-600">
                Access your comprehensive dashboard to view and manage your data in real-time.
              </p>
            </div>
          </Link>
          
          <Link href="/CustomizeTable">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Table Customization</h3>
              <p className="text-gray-600">
                Personalize your tables with our intuitive customization tools.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}