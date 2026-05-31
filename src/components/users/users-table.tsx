"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
  useUsers,
} from "@/features/users/hooks";
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
  username: z.string().min(3, "Username is required"),
  password: z.string().min(6, "Password should be at least 6 characters"),
});

type FormValues = z.infer<typeof schema>;

export default function UsersTable() {
  const usersQuery = useUsers();
  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { username: "", password: "" },
  });

  const users = usersQuery.data?.data ?? [];

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, ...values });
        toast.success("User updated");
      } else {
        await createMutation.mutateAsync(values);
        toast.success("User created");
      }
      form.reset();
      setEditingId(null);
      setOpen(false);
    } catch (error) {
      toast.error("Failed to save user");
    }
  });

  const startEdit = (id: string) => {
    const found = users.find((user) => user.id === id);
    if (!found) return;
    form.reset({ username: found.username, password: "" });
    setEditingId(id);
    setOpen(true);
  };

  const confirmDelete = async () => {
    if (!confirmId) return;
    try {
      await deleteMutation.mutateAsync(confirmId);
      toast.success("User deleted");
    } catch (error) {
      toast.error("Failed to delete user");
    } finally {
      setConfirmId(null);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">
            Manage admin users who can access the dashboard.
          </p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="h-4 w-4" />
          Add user
        </Button>
      </div>

      {usersQuery.isLoading ? (
        <div className="grid gap-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-14" />
          ))}
        </div>
      ) : usersQuery.isError ? (
        <EmptyState
          title="Users unavailable"
          description="We could not load users. The backend may not expose user CRUD yet."
        />
      ) : users.length === 0 ? (
        <EmptyState
          title="No users"
          description="Create an admin user to start managing the system."
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell className="text-muted-foreground">
                  {user.created_at ?? "-"}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {user.updated_at ?? "-"}
                </TableCell>
                <TableCell className="flex justify-end gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => startEdit(user.id)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => setConfirmId(user.id)}
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
            <DialogTitle>{editingId ? "Edit user" : "Create user"}</DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" {...form.register("username")} />
              {form.formState.errors.username ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.username.message}
                </p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...form.register("password")}
              />
              {form.formState.errors.password ? (
                <p className="text-xs text-destructive">
                  {form.formState.errors.password.message}
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
        title="Delete user"
        description="This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
      />
    </section>
  );
}
