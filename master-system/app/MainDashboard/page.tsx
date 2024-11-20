"use client"

import { Calendar, Home, Inbox, Menu, Search, Settings } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useState } from "react"

export default function MainDashboard() {
  const [open, setOpen] = useState(false)

  const items = [
    {
      title: "Home",
      icon: Home,
      url: "/",
    },
    {
      title: "Search",
      icon: Search,
      url: "/search",
    },
    {
      title: "Inbox",
      icon: Inbox,
      url: "/inbox",
    },
    {
      title: "Calendar",
      icon: Calendar,
      url: "/calendar",
    },
    {
      title: "Settings",
      icon: Settings,
      url: "/settings",
    },
  ]

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <div className="flex">
        <Sidebar>
          <SidebarTrigger className="absolute right-[-40px] top-3 bg-white rounded-lg hover:bg-gray-100 shadow-md">
            <Menu className="h-4 w-4" />
          </SidebarTrigger>
          
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Application</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
          <h1>Main Dashboard</h1>
        </div>
      </div>
    </SidebarProvider>
  )
}
