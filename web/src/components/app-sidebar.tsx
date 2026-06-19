"use client"

import * as React from "react"
import Link from "next/link"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { FileTextIcon, BarChart3Icon, Settings2Icon, ScrollTextIcon, LifeBuoyIcon, TerminalIcon } from "lucide-react"

const data = {
  navMain: [
    {
      title: "Posts",
      url: "/posts",
      icon: <FileTextIcon />,
    },
    {
      title: "Analytics",
      url: "/analytics",
      icon: <BarChart3Icon />,
    },
    {
      title: "Configure",
      url: "/configure",
      icon: <Settings2Icon />,
    },
    {
      title: "Audit Logs",
      url: "/logs",
      icon: <ScrollTextIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: <LifeBuoyIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <TerminalIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Sloogle</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
