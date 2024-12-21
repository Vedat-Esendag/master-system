"use client";

import { RedirectToSignIn, useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import supabase from '@/config/supabaseClient';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Home() {
  const { user, isLoaded } = useUser();
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeUserData = async () => {
      try {
        if (!user?.id) {
          console.log('No user ID available');
          return;
        }

        console.log('Attempting operation with user:', {
          id: user.id,
          email: user.emailAddresses[0]?.emailAddress
        });

        const { data: connectionTest, error: connectionError } = await supabase
          .from('users')
          .select('count')
          .limit(1);
        
        console.log('Connection test:', { connectionTest, connectionError });

        const { data: existingData, error: checkError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', user.id);

        console.log('Existing data check:', { existingData, checkError });

        if (checkError) {
          console.error('Error checking user data:', checkError);
          setError(checkError.message);
          return;
        }

        if (!existingData || existingData.length === 0) {
          const initialData = {
            user_id: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            created_at: new Date().toISOString()
          };

          console.log('Attempting to insert data:', initialData);

          const { data: newData, error: insertError } = await supabase
            .from('users')
            .insert([initialData])
            .select();

          console.log('Insert operation result:', { newData, insertError });

          if (insertError) {
            console.error('Insert error details:', {
              code: insertError.code,
              message: insertError.message,
              details: insertError.details,
              hint: insertError.hint
            });
            setError(insertError.message);
            return;
          }

          setData(newData || []);
        } else {
          setData(existingData);
        }

      } catch (err) {
        console.error('Unexpected error:', err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      }
    };

    if (user) {
      initializeUserData();
    }
  }, [user]);

  if (!isLoaded || !user) {
    return <RedirectToSignIn />;
  }
  console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  const testSupabase = async () => {
    const { data, error } = await supabase.from("users").select("*").limit(1);
    if (error) {
      console.error("Supabase test query error:", error);
    } else {
      console.log("Supabase test query result:", data);
    }
  };

  testSupabase();
  console.log({ user, isLoaded });
  console.log(supabase);
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Welcome to FlexiSpace</h2>
        <p className="text-gray-600 text-lg mb-8">
          Your all-in-one solution for managing and customizing your workspace. 
          Navigate to the Main Dashboard to view your data or use the Customize Table feature 
          to tailor your tables according to your needs.
        </p>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Main Dashboard</CardTitle>
              <CardDescription>
                Access your comprehensive dashboard to view and manage your data in real-time.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Table Customization</CardTitle>
              <CardDescription>
                Personalize your tables with our intuitive customization tools.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}