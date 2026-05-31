"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/constants/navigation";
import { SITE_NAME, SITE_TAGLINE } from "@/constants/site";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const SidebarContent = () => {
  const pathname = usePathname();

  return (
    <aside className="flex h-full flex-col gap-8 border-r border-border bg-white/70 px-6 py-8 backdrop-blur">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Library
        </p>
        <h1 className="font-serif text-2xl font-semibold">{SITE_NAME}</h1>
        <p className="text-sm text-muted-foreground">{SITE_TAGLINE}</p>
      </div>
      <nav className="flex flex-col gap-2">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-primary text-primary-foreground shadow-glow"
                  : "text-muted-foreground hover:bg-muted",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto rounded-xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
        Tip: Connect to the API to unlock full CRUD actions for books and users.
      </div>
    </aside>
  );
};

export default function Sidebar({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (value: boolean) => void;
}) {
  return (
    <>
      <div className="hidden w-72 md:block">
        <SidebarContent />
      </div>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="w-[90vw] max-w-sm p-0">
          <SidebarContent />
        </DialogContent>
      </Dialog>
    </>
  );
}
