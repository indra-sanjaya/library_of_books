"use client";

import PageHeader from "@/components/layout/page-header";
import EmptyState from "@/components/layout/empty-state";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useBooks } from "@/features/books/hooks";
import { useUsers } from "@/features/users/hooks";
import { formatDate, formatNumber } from "@/lib/format";

export default function DashboardPage() {
  const booksQuery = useBooks();
  const usersQuery = useUsers();

  const books = booksQuery.data?.data ?? [];
  const users = usersQuery.data?.data ?? [];
  const recentBooks = [...books]
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))
    .slice(0, 4);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Library overview"
        subtitle="Monitor inventory health, reading activity, and user operations in one place."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {booksQuery.isLoading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-32" />
          ))
        ) : (
          <>
            <Card>
              <CardHeader>
                <CardDescription>Total Books</CardDescription>
                <CardTitle className="text-3xl">
                  {formatNumber(books.length)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Catalog items synced from the public API.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Total Users</CardDescription>
                <CardTitle className="text-3xl">
                  {formatNumber(users.length)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Based on admin user records.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Recently Added</CardDescription>
                <CardTitle className="text-3xl">
                  {formatNumber(recentBooks.length)}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Latest titles added to the catalog.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardDescription>Latest Activity</CardDescription>
                <CardTitle className="text-3xl">Live</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Streaming updates from the API.
              </CardContent>
            </Card>
          </>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Recent books</CardTitle>
            <CardDescription>Newest arrivals in the library.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {booksQuery.isLoading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-16" />
              ))
            ) : booksQuery.isError ? (
              <EmptyState
                title="Books unavailable"
                description="We could not load the latest books. Please check the API connection."
              />
            ) : recentBooks.length === 0 ? (
              <EmptyState
                title="No books yet"
                description="Add new titles to populate the dashboard."
              />
            ) : (
              recentBooks.map((book) => (
                <div
                  key={book.id_buku}
                  className="flex items-center justify-between rounded-lg border border-border bg-white/70 p-4"
                >
                  <div>
                    <p className="font-medium">{book.judul_buku}</p>
                    <p className="text-xs text-muted-foreground">
                      {book.isbn} • {formatDate(book.created_at)}
                    </p>
                  </div>
                  <Badge variant="success">{book.stok_buku} in stock</Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Latest activity</CardTitle>
            <CardDescription>
              Inventory changes and admin updates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {booksQuery.isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-10" />
                ))
              : recentBooks.map((book) => (
                  <div
                    key={book.id_buku}
                    className="rounded-lg border border-border bg-white/60 p-3"
                  >
                    <p className="text-sm font-medium">
                      New title: {book.judul_buku}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(book.created_at)}
                    </p>
                  </div>
                ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
