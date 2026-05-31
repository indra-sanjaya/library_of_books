"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Breadcrumbs from "@/components/layout/breadcrumbs";
import { SITE_NAME } from "@/constants/site";

const titleMap: Record<string, string> = {
  "/": "Dashboard",
  "/books": "Books",
  "/users": "Users",
};

export default function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const pathname = usePathname();
  const title = titleMap[pathname] ?? SITE_NAME;

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-white/70 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {title}
            </p>
            <Breadcrumbs />
          </div>
        </div>
        <div className="hidden items-center gap-3 md:flex">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search across library" className="w-64 pl-9" />
          </div>
          <Button asChild variant="outline">
            <Link href="/books">Open catalog</Link>
          </Button>
          <Avatar>
            <AvatarFallback>LB</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
