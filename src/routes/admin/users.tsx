import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { CreateUserModal } from "@/components/admin/CreateUserModal";
import { EditUserModal } from "@/components/admin/EditUserModal";
import { adminGetUsers, adminToggleUserStatus } from "@/api/auth";
import { format } from "date-fns";
import { Users, Power, Edit2, Loader2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  const { data: users, isLoading, refetch } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => adminGetUsers(),
  });

  const handleToggle = async (id: string, role: string) => {
    if (role === "SUPER_ADMIN") {
      toast.error("Cannot disable a Super Admin account");
      return;
    }
    
    setTogglingId(id);
    try {
      const res = await adminToggleUserStatus({ data: { id } });
      if (!res.success) throw new Error(res.error);
      toast.success("User status updated");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to update user");
    } finally {
      setTogglingId(null);
    }
  };

  const columns = [
    {
      header: "User",
      accessor: (row: any) => (
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gold/10 text-gold font-bold uppercase">
            {row.name.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-foreground">{row.name}</p>
            <p className="text-xs text-muted-foreground">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: (row: any) => {
        let badgeClass = "bg-white/5 text-muted-foreground border-white/10";
        if (row.role === "SUPER_ADMIN") badgeClass = "bg-purple-500/10 text-purple-500 border-purple-500/20";
        if (row.role === "ADMIN") badgeClass = "bg-blue-500/10 text-blue-500 border-blue-500/20";
        
        return (
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${badgeClass}`}>
            {row.role === "SUPER_ADMIN" && <ShieldAlert size={12} />}
            {row.role.replace("_", " ")}
          </span>
        );
      },
    },
    {
      header: "Last Login",
      accessor: (row: any) => (
        <span className="text-sm text-muted-foreground">
          {row.lastLoginAt ? format(new Date(row.lastLoginAt), "MMM d, yyyy HH:mm") : "Never"}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${row.isActive ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
          {row.isActive ? 'Active' : 'Disabled'}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          {row.role !== "SUPER_ADMIN" && (
            <button 
              onClick={() => handleToggle(row.id, row.role)}
              disabled={togglingId === row.id}
              className={`flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition-colors ${row.isActive ? 'bg-white/5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30'}`}
              title={row.isActive ? "Disable User" : "Enable User"}
            >
              {togglingId === row.id ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <Power size={14} />
              )}
            </button>
          )}
          <button 
            onClick={() => setEditingUser(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
            title="Edit User"
          >
            <Edit2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminHeader title="Users & Staff" />
      <div className="flex-1 p-8">
        
        <div className="mb-6 flex justify-end">
          <button 
            onClick={() => setIsUserModalOpen(true)}
            className="rounded-xl bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-gold/90 transition-colors"
          >
            + Add User
          </button>
        </div>

        <DataTable
          columns={columns}
          data={users || []}
          isLoading={isLoading}
          emptyState="No users found."
        />
        
        <CreateUserModal 
          open={isUserModalOpen} 
          onOpenChange={setIsUserModalOpen} 
          onSuccess={() => refetch()} 
        />
        
        <EditUserModal 
          open={!!editingUser}
          onOpenChange={(val) => !val && setEditingUser(null)}
          onSuccess={() => {
            setEditingUser(null);
            refetch();
          }}
          user={editingUser}
        />
      </div>
    </>
  );
}
