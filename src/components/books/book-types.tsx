"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Trash2, Pencil } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  useBookTypes,
  useCreateBook,
  useDeleteBook,
  useUpdateBook,
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
  jenis_buku: z.string().min(3, "Type name is required"),
  deskripsi: z.string().min(3, "Description is required"),
});

type FormValues = z.infer<typeof schema>;

export default function BookTypes() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 250);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const typesQuery = useBookTypes(debounced);
  const createMutation = useCreateBook();
  const updateMutation = useUpdateBook();
  const deleteMutation = useDeleteBook();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { jenis_buku: "", deskripsi: "" },
  });

  const types = typesQuery.data?.data ?? [];
  const filtered = useMemo(() => {
    if (!debounced) return types;
    const q = debounced.toLowerCase();
    return types.filter((type) => type.jenis_buku.toLowerCase().includes(q));
  }, [types, debounced]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...values });
        toast.success("Book type updated");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Book type created");
      }
      form.reset();
      setEditingId(null);
      setOpen(false);
    } catch (error) {
      toast.error("Failed to save book type");
    }
  });

  const startEdit = (id: string) => {
    const found = types.find((type) => type.id === id);
    if (!found) return;
    form.reset({ jenis_buku: found.jenis_buku, deskripsi: found.deskripsi });
    setEditingId(id);
    setOpen(true);
  };

  const confirmDelete = async () => {
    if (!confirmId) return;
    try {
      await deleteMutation.mutateAsync(confirmId);
      toast.success("Book type deleted");
    } catch (error) {
      toast.error("Failed to delete book type");
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
            placeholder="Search book types"
            className="pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Add type
        </Button>
      </div>

      {typesQuery.isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-14" />
          ))}
        </div>
      ) : typesQuery.isError ? (
        <EmptyState
          title="Types unavailable"
          description="We could not load book types. Ensure your admin token is valid."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No book types"
          description="Create a book type to get started."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((type) => (
              <TableRow key={type.id}>
                <TableCell className="font-medium">{type.jenis_buku}</TableCell>
                <TableCell className="text-muted-foreground">
                  {type.deskripsi}
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => startEdit(type.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setConfirmId(type.id)}
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
              {editingId ? "Edit book type" : "Create book type"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="jenis_buku">Type name</Label>
              <Input id="jenis_buku" {...form.register("jenis_buku")} />
              {form.formState.errors.jenis_buku ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.jenis_buku.message}
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
        title="Delete book type"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </section>
  );
}
