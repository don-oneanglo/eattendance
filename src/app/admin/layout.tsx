"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons/logo";
import { Home, Users, UserCog, BookText, School, ChevronLeft, ScanFace } from "lucide-react";
import { Button } from "@/components/ui/button";

const menuItems = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/teachers", label: "Teachers", icon: UserCog },
  { href: "/admin/subjects", label: "Subjects", icon: BookText },
  { href: "/admin/classes", label: "Classes", icon: School },
  { href: "/admin/face-registration", label: "Face Registration", icon: ScanFace },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo />
            <span className="font-headline text-xl font-bold text-primary">FaceAttend</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map(item => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton isActive={pathname === item.href} tooltip={item.label}>
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            <Link href="/dashboard" className="w-full">
                <Button variant="outline" className="w-full">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Back to App
                </Button>
            </Link>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger />
            <h1 className="font-headline text-2xl font-bold">Admin Panel</h1>
        </header>
        <main className="p-4 md:p-8 bg-background">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
