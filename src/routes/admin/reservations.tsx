import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { adminGetReservations, adminUpdateReservation } from "@/api/reservation";
import { useState } from "react";
import { format } from "date-fns";
import { Check, X, Calendar, Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/reservations")({
  component: AdminReservations,
});

function AdminReservations() {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", "reservations", statusFilter, dateFilter],
    queryFn: () => adminGetReservations({ data: { status: statusFilter || undefined, date: dateFilter || undefined } }),
  });

  const handleUpdateStatus = async (id: string, status: "CONFIRMED" | "REJECTED" | "CANCELLED" | "COMPLETED") => {
    setUpdatingId(id);
    try {
      const res = await adminUpdateReservation({ data: { id, status } });
      if (res.success) {
        toast.success(`Reservation marked as ${status}`);
        refetch();
      } else {
        toast.error(res.error || "Failed to update reservation");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update reservation");
    } finally {
      setUpdatingId(null);
    }
  };

  const columns = [
    {
      header: "Guest",
      accessor: (row: any) => (
        <div>
          <p className="font-medium text-foreground">{row.name}</p>
          <p className="text-xs text-muted-foreground">{row.email}</p>
          <p className="text-xs text-muted-foreground">{row.phone}</p>
        </div>
      ),
    },
    {
      header: "Date & Time",
      accessor: (row: any) => (
        <div>
          <div className="flex items-center gap-1.5 font-medium text-foreground">
            <Calendar size={14} className="text-gold" />
            {format(new Date(row.date), "MMM d, yyyy")}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{row.time}</p>
        </div>
      ),
    },
    {
      header: "Details",
      accessor: (row: any) => (
        <div>
          <p className="text-sm"><span className="text-muted-foreground">Guests:</span> {row.guests}</p>
          <p className="text-sm capitalize"><span className="text-muted-foreground">Occasion:</span> {row.occasion.toLowerCase()}</p>
          {row.specialRequests && (
            <p className="mt-1 text-xs italic text-gold max-w-[200px] truncate" title={row.specialRequests}>
              "{row.specialRequests}"
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (row: any) => {
        const colors: Record<string, string> = {
          PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
          CONFIRMED: "bg-green-500/10 text-green-500 border-green-500/20",
          REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
          CANCELLED: "bg-gray-500/10 text-gray-400 border-gray-500/20",
          COMPLETED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        };
        return (
          <span className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold uppercase tracking-wider ${colors[row.status]}`}>
            {row.status}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          {updatingId === row.id ? (
            <Loader2 className="animate-spin text-gold" size={18} />
          ) : (
            <>
              {row.status === "PENDING" && (
                <>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleUpdateStatus(row.id, "CONFIRMED"); }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-colors"
                    title="Confirm"
                  >
                    <Check size={16} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleUpdateStatus(row.id, "REJECTED"); }}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                    title="Reject"
                  >
                    <X size={16} />
                  </button>
                </>
              )}
              {row.status === "CONFIRMED" && (
                <button 
                  onClick={(e) => { e.stopPropagation(); handleUpdateStatus(row.id, "COMPLETED"); }}
                  className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-500 hover:bg-blue-500 hover:text-white transition-colors"
                >
                  Complete
                </button>
              )}
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminHeader title="Reservations" />
      <div className="flex-1 p-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-10 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 [color-scheme:dark]"
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter("")}
                className="text-xs text-muted-foreground hover:text-foreground underline"
              >
                Clear Date
              </button>
            )}
          </div>
        </div>

        <DataTable
          columns={columns}
          data={data?.reservations || []}
          isLoading={isLoading}
          emptyState="No reservations found for the selected filters."
        />
      </div>
    </>
  );
}
