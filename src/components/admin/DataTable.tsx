import React from "react";
import { Loader2 } from "lucide-react";

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
}

export function DataTable<T extends { id: string }>({ 
  columns, 
  data, 
  isLoading, 
  onRowClick,
  emptyState = "No data found."
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02]">
        <Loader2 className="animate-spin text-gold" size={32} />
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02] text-muted-foreground">
        {emptyState}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
      <div className="overflow-x-auto pb-4 scrollbar-hide">
        <table className="w-full text-left text-sm whitespace-nowrap md:whitespace-normal">
          <thead className="border-b border-white/5 bg-white/[0.02] text-xs uppercase text-muted-foreground">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={`px-6 py-4 font-medium ${col.className || ""}`}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {data.map((row) => (
              <tr 
                key={row.id} 
                onClick={() => onRowClick && onRowClick(row)}
                className={`transition-colors hover:bg-white/5 ${onRowClick ? "cursor-pointer" : ""}`}
              >
                {columns.map((col, i) => (
                  <td key={i} className={`px-6 py-4 ${col.className || ""}`}>
                    {typeof col.accessor === "function"
                      ? col.accessor(row)
                      : (row[col.accessor] as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
