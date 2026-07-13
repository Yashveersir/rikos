import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { adminGetMessages, adminMarkAsRead } from "@/api/contact";
import { format } from "date-fns";
import { Mail, Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/admin/messages")({
  component: AdminMessages,
});

function AdminMessages() {
  const [markingId, setMarkingId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", "messages"],
    queryFn: () => adminGetMessages(),
  });

  const handleMarkRead = async (id: string) => {
    setMarkingId(id);
    try {
      const res = await adminMarkAsRead({ data: { id } });
      if (!res.success) throw new Error(res.error);
      toast.success("Message marked as read");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to update message");
    } finally {
      setMarkingId(null);
    }
  };

  const columns = [
    {
      header: "From",
      accessor: (row: any) => (
        <div>
          <div className="flex items-center gap-2">
            {!row.isRead && (
              <span className="h-2 w-2 rounded-full bg-gold" />
            )}
            <p className={`font-medium ${row.isRead ? 'text-muted-foreground' : 'text-foreground'}`}>
              {row.name}
            </p>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{row.email}</p>
          {row.phone && <p className="text-xs text-muted-foreground">{row.phone}</p>}
        </div>
      ),
    },
    {
      header: "Message",
      accessor: (row: any) => (
        <div className="max-w-md">
          {row.subject && <p className="font-medium text-foreground text-sm mb-1">{row.subject}</p>}
          <p className="text-sm text-muted-foreground line-clamp-2">{row.message}</p>
        </div>
      ),
    },
    {
      header: "Date",
      accessor: (row: any) => (
        <div className="text-sm text-muted-foreground">
          {format(new Date(row.createdAt), "MMM d, yyyy")}
          <br />
          <span className="text-xs">{format(new Date(row.createdAt), "h:mm a")}</span>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          {!row.isRead ? (
            <button
              onClick={() => handleMarkRead(row.id)}
              disabled={markingId === row.id}
              className="flex items-center gap-1.5 rounded-lg border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold hover:bg-gold hover:text-white transition-all"
            >
              {markingId === row.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
              Mark Read
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground">
              <Check size={14} /> Read
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminHeader title="Messages & Inquiries" />
      <div className="flex-1 p-8">
        <DataTable
          columns={columns}
          data={data?.messages || []}
          isLoading={isLoading}
          emptyState={
            <div className="flex flex-col items-center py-12 text-muted-foreground">
              <Mail size={48} className="mb-4 opacity-20" />
              <p>No messages received yet.</p>
            </div>
          }
        />
      </div>
    </>
  );
}
