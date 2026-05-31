"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import PageHeader from "@/components/layout/page-header";
import BooksCatalog from "@/components/books/books-catalog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const BookTypes = dynamic(() => import("@/components/books/book-types"));
const Authors = dynamic(() => import("@/components/books/authors"));
const Publishers = dynamic(() => import("@/components/books/publishers"));

const sections = [
  { key: "catalog", label: "Catalog" },
  { key: "types", label: "Book Types" },
  { key: "authors", label: "Authors" },
  { key: "publishers", label: "Publishers" },
] as const;

type SectionKey = (typeof sections)[number]["key"];

export default function BooksPage() {
  const [active, setActive] = useState<SectionKey>("catalog");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Books"
        subtitle="Browse the catalog or manage book metadata across the library system."
      />
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => (
          <Button
            key={section.key}
            variant={active === section.key ? "default" : "outline"}
            onClick={() => setActive(section.key)}
            className={cn(active === section.key ? "shadow-glow" : "")}
          >
            {section.label}
          </Button>
        ))}
      </div>
      {active === "catalog" ? <BooksCatalog /> : null}
      {active === "types" ? <BookTypes /> : null}
      {active === "authors" ? <Authors /> : null}
      {active === "publishers" ? <Publishers /> : null}
    </div>
  );
}
