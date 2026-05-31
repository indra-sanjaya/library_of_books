"use client";

import PageHeader from "@/components/layout/page-header";
import UsersTable from "@/components/users/users-table";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        subtitle="Manage admin accounts and access for the library dashboard."
      />
      <UsersTable />
    </div>
  );
}
