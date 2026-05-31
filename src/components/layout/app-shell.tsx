"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import Topbar from "@/components/layout/topbar";
import { cn } from "@/lib/utils";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="bg-grid min-h-screen">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px]">
        <Sidebar open={open} onOpenChange={setOpen} />
        <div className={cn("flex min-h-screen w-full flex-col")}>
          <Topbar onMenuClick={() => setOpen(true)} />
          <main className="flex-1 px-4 pb-10 pt-6 md:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
