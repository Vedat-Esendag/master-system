"use client";

import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export default function Home() {
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
