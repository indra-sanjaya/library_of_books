"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/layout/empty-state";
import PageHeader from "@/components/layout/page-header";
import { useBook } from "@/features/books/hooks";
import { formatDate } from "@/lib/format";

export default function BookDetailPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const bookQuery = useBook(id);
  const book = bookQuery.data?.data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={book ? book.judul_buku : "Book details"}
        subtitle="Detailed record from the public catalog."
        actions={
          <Button asChild variant="outline">
            <Link href="/books">Back to catalog</Link>
          </Button>
        }
      />

      {bookQuery.isLoading ? (
        <Skeleton className="h-64" />
      ) : bookQuery.isError || !book ? (
        <EmptyState
          title="Book not found"
          description="We could not load this book detail."
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Catalog details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                ISBN
              </p>
              <p className="text-sm font-medium">{book.isbn}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Stock
              </p>
              <Badge variant={book.stok_buku > 0 ? "success" : "warning"}>
                {book.stok_buku}
              </Badge>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Published
              </p>
              <p className="text-sm font-medium">{book.tahun_terbit}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Rack
              </p>
              <p className="text-sm font-medium">{book.rak_buku}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Description
              </p>
              <p className="text-sm text-muted-foreground">
                {book.deskripsi_buku}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Created
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDate(book.created_at)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Updated
              </p>
              <p className="text-sm text-muted-foreground">
                {formatDate(book.updated_at)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
