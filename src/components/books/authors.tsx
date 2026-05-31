"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Trash2, Pencil } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  useAuthors,
  useCreateAuthor,
  useDeleteAuthor,
  useUpdateAuthor,
} from "@/features/books/hooks";
import { useDebounce } from "@/hooks/use-debounce";
import EmptyState from "@/components/layout/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ConfirmDialog from "@/components/ui/confirm-dialog";

const schema = z.object({
  penulis_buku: z.string().min(3, "Author name is required"),
  alamat_penulis: z.string().min(3, "Address is required"),
  email_penulis: z.string().email("Provide a valid email"),
  deskripsi: z.string().min(3, "Description is required"),
});

type FormValues = z.infer<typeof schema>;

export default function Authors() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 250);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const authorsQuery = useAuthors(debounced);
  const createMutation = useCreateAuthor();
  const updateMutation = useUpdateAuthor();
  const deleteMutation = useDeleteAuthor();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      penulis_buku: "",
      alamat_penulis: "",
      email_penulis: "",
      deskripsi: "",
    },
  });

  const authors = authorsQuery.data?.data ?? [];
  const filtered = useMemo(() => {
    if (!debounced) return authors;
    const q = debounced.toLowerCase();
    return authors.filter((author) =>
      author.penulis_buku.toLowerCase().includes(q),
    );
  }, [authors, debounced]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...values });
        toast.success("Author updated");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Author created");
      }
      form.reset();
      setEditingId(null);
      setOpen(false);
    } catch (error) {
      toast.error("Failed to save author");
    }
  });

  const startEdit = (id: string) => {
    const found = authors.find((author) => author.id === id);
    if (!found) return;
    form.reset({
      penulis_buku: found.penulis_buku,
      alamat_penulis: found.alamat,
      email_penulis: found.email_penulis,
      deskripsi: found.deskripsi,
    });
    setEditingId(id);
    setOpen(true);
  };

  const confirmDelete = async () => {
    if (!confirmId) return;
    try {
      await deleteMutation.mutateAsync(confirmId);
      toast.success("Author deleted");
    } catch (error) {
      toast.error("Failed to delete author");
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search authors"
            className="pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Add author
        </Button>
      </div>

      {authorsQuery.isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-14" />
          ))}
        </div>
      ) : authorsQuery.isError ? (
        <EmptyState
          title="Authors unavailable"
          description="We could not load author data. Please check your API token."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No authors"
          description="Create an author to start tracking book contributors."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Address</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((author) => (
              <TableRow key={author.id}>
                <TableCell className="font-medium">
                  {author.penulis_buku}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {author.email_penulis}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {author.alamat}
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => startEdit(author.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setConfirmId(author.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit author" : "Create author"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="penulis_buku">Author name</Label>
              <Input id="penulis_buku" {...form.register("penulis_buku")} />
              {form.formState.errors.penulis_buku ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.penulis_buku.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email_penulis">Email</Label>
              <Input
                id="email_penulis"
                type="email"
                {...form.register("email_penulis")}
              />
              {form.formState.errors.email_penulis ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.email_penulis.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="alamat_penulis">Address</Label>
              <Input id="alamat_penulis" {...form.register("alamat_penulis")} />
              {form.formState.errors.alamat_penulis ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.alamat_penulis.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="deskripsi">Description</Label>
              <Textarea id="deskripsi" {...form.register("deskripsi")} />
              {form.formState.errors.deskripsi ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.deskripsi.message}
                </p>
              ) : null}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingId ? "Save changes" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={Boolean(confirmId)}
        onOpenChange={(value) => setConfirmId(value ? confirmId : null)}
        title="Delete author"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </section>
  );
}
