"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Trash2, Pencil } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  usePublishers,
  useCreatePublisher,
  useDeletePublisher,
  useUpdatePublisher,
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
  penerbit_buku: z.string().min(3, "Publisher name is required"),
  alamat_penerbit: z.string().min(3, "Address is required"),
  telp_penerbit: z.string().min(3, "Phone is required"),
  email_penerbit: z.string().email("Provide a valid email"),
  deskripsi: z.string().min(3, "Description is required"),
});

type FormValues = z.infer<typeof schema>;

export default function Publishers() {
  const [query, setQuery] = useState("");
  const debounced = useDebounce(query, 250);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const publishersQuery = usePublishers(debounced);
  const createMutation = useCreatePublisher();
  const updateMutation = useUpdatePublisher();
  const deleteMutation = useDeletePublisher();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      penerbit_buku: "",
      alamat_penerbit: "",
      telp_penerbit: "",
      email_penerbit: "",
      deskripsi: "",
    },
  });

  const publishers = publishersQuery.data?.data ?? [];
  const filtered = useMemo(() => {
    if (!debounced) return publishers;
    const q = debounced.toLowerCase();
    return publishers.filter((publisher) =>
      publisher.penerbit_buku.toLowerCase().includes(q),
    );
  }, [publishers, debounced]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...values });
        toast.success("Publisher updated");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("Publisher created");
      }
      form.reset();
      setEditingId(null);
      setOpen(false);
    } catch (error) {
      toast.error("Failed to save publisher");
    }
  });

  const startEdit = (id: string) => {
    const found = publishers.find((publisher) => publisher.id === id);
    if (!found) return;
    form.reset({
      penerbit_buku: found.penerbit_buku,
      alamat_penerbit: found.alamat_penerbit,
      telp_penerbit: found.telp_penerbit ?? "",
      email_penerbit: found.email_penerbit,
      deskripsi: found.deskripsi ?? "",
    });
    setEditingId(id);
    setOpen(true);
  };

  const confirmDelete = async () => {
    if (!confirmId) return;
    try {
      await deleteMutation.mutateAsync(confirmId);
      toast.success("Publisher deleted");
    } catch (error) {
      toast.error("Failed to delete publisher");
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
            placeholder="Search publishers"
            className="pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Add publisher
        </Button>
      </div>

      {publishersQuery.isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-14" />
          ))}
        </div>
      ) : publishersQuery.isError ? (
        <EmptyState
          title="Publishers unavailable"
          description="We could not load publisher data. Please check your API token."
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No publishers"
          description="Create a publisher to manage catalog metadata."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((publisher) => (
              <TableRow key={publisher.id}>
                <TableCell className="font-medium">
                  {publisher.penerbit_buku}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {publisher.email_penerbit}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {publisher.telp_penerbit ?? "-"}
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => startEdit(publisher.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setConfirmId(publisher.id)}
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
              {editingId ? "Edit publisher" : "Create publisher"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="penerbit_buku">Publisher name</Label>
              <Input id="penerbit_buku" {...form.register("penerbit_buku")} />
              {form.formState.errors.penerbit_buku ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.penerbit_buku.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email_penerbit">Email</Label>
              <Input
                id="email_penerbit"
                type="email"
                {...form.register("email_penerbit")}
              />
              {form.formState.errors.email_penerbit ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.email_penerbit.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="telp_penerbit">Phone</Label>
              <Input id="telp_penerbit" {...form.register("telp_penerbit")} />
              {form.formState.errors.telp_penerbit ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.telp_penerbit.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="alamat_penerbit">Address</Label>
              <Input
                id="alamat_penerbit"
                {...form.register("alamat_penerbit")}
              />
              {form.formState.errors.alamat_penerbit ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.alamat_penerbit.message}
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
        title="Delete publisher"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </section>
  );
}
