"use client";

import Link from "next/link";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useBooks } from "@/features/books/hooks";
import { useDebounce } from "@/hooks/use-debounce";
import { formatDate } from "@/lib/format";
import EmptyState from "@/components/layout/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

export default function BooksCatalog() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 250);
  const booksQuery = useBooks();

  const books = booksQuery.data?.data ?? [];
  const filtered = useMemo(() => {
    if (!debounced) return books;
    const q = debounced.toLowerCase();
    return books.filter(
      (book) =>
        book.judul_buku.toLowerCase().includes(q) ||
        book.isbn.toLowerCase().includes(q),
    );
  }, [books, debounced]);

  return (
    <section className="space-y-4">
      <div className="relative max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search books by title or ISBN"
          className="pl-9"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {booksQuery.isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16" />
          ))}
        </div>
      ) : booksQuery.isError ? (
        <EmptyState
          title="Catalog unavailable"
          description="We could not load the book catalog. Verify the API service is running."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No books found"
          description="Try another keyword or add new titles."
        />
      ) : (
        <>
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((book) => (
                  <TableRow key={book.id_buku}>
                    <TableCell>
                      <Link
                        href={`/books/${book.id_buku}`}
                        className="font-medium hover:underline"
                      >
                        {book.judul_buku}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {book.isbn}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={book.stok_buku > 0 ? "success" : "warning"}
                      >
                        {book.stok_buku}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(book.updated_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="grid gap-3 md:hidden">
            {filtered.map((book) => (
              <Card key={book.id_buku}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/books/${book.id_buku}`}
                      className="font-medium"
                    >
                      {book.judul_buku}
                    </Link>
                    <Badge variant={book.stok_buku > 0 ? "success" : "warning"}>
                      {book.stok_buku}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{book.isbn}</p>
                  <p className="text-xs text-muted-foreground">
                    Updated {formatDate(book.updated_at)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </section>
  );
}
