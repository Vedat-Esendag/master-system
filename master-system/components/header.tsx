"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
            href="/CustomizeTable" 
            className="px-4 py-2 bg-green-500 rounded-md hover:bg-green-600 transition-colors"
          >
            Customize Table
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 transition-colors">
                Edit Profile
              </Button>
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
            <SheetTrigger asChild>
              <Button variant="ghost" className="px-4 py-2 bg-purple-500 hover:bg-purple-600 transition-colors">
                Delete Account
              </Button>
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
  );
}