"use client"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function Home() {
  return (
    <div className="min-h-screen">
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
              href="/CustomizeTable" 
              className="px-4 py-2 bg-green-500 rounded-md hover:bg-green-600 transition-colors"
            >
              Customize Table
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <button className="px-4 py-2 bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors">
                  Edit Profile
                </button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader>
                  <SheetTitle>Edit profile</SheetTitle>
                  <SheetDescription>
                    Make changes to your profile here. Click save when you're done.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input id="username" defaultValue="@peduarte" className="col-span-3" />
                  </div>
                </div>
                <SheetFooter>
                  <SheetClose asChild>
                    <Button type="submit">Save changes</Button>
                  </SheetClose>
                </SheetFooter>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger className="px-4 py-2 bg-purple-500 rounded-md hover:bg-purple-600 transition-colors">
                Delete Account
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Are you absolutely sure?</SheetTitle>
                  <SheetDescription>
                    This action cannot be undone. This will permanently delete your account
                    and remove your data from our servers.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>
      
      <main className="max-w-5xl mx-auto p-8">
        <h2 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h2>
        <p className="text-gray-600 text-lg mb-6">
          FlexiSpace is your all-in-one solution for managing and customizing your workspace. 
          Navigate to the Main Dashboard to view your data or use the Customize Table feature 
          to tailor your tables according to your needs.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Main Dashboard</h3>
            <p className="text-gray-600">
              Access your comprehensive dashboard to view and manage your data in real-time.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Table Customization</h3>
            <p className="text-gray-600">
              Personalize your tables with our intuitive customization tools.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
