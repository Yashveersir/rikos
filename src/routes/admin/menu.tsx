import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DataTable } from "@/components/admin/DataTable";
import { CreateCategoryModal } from "@/components/admin/CreateCategoryModal";
import { CreateItemModal } from "@/components/admin/CreateItemModal";
import { EditItemModal } from "@/components/admin/EditItemModal";
import { adminGetCategories, adminGetItems, adminToggleItem } from "@/api/menu";
import { Plus, Power, Edit2, Loader2, GripVertical } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/menu")({
  component: AdminMenu,
});

function AdminMenu() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  const { data: categories, isLoading: isLoadingCats } = useQuery({
    queryKey: ["admin", "menu", "categories"],
    queryFn: () => adminGetCategories(),
  });

  const { data: items, isLoading: isLoadingItems, refetch } = useQuery({
    queryKey: ["admin", "menu", "items", activeCategory],
    queryFn: () => adminGetItems({ data: { categoryId: activeCategory || undefined } }),
    enabled: !!categories,
  });

  const handleToggle = async (id: string) => {
    setTogglingId(id);
    try {
      const res = await adminToggleItem({ data: { id } });
      if (!res.success) throw new Error(res.error);
      toast.success("Item availability updated");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to update item");
    } finally {
      setTogglingId(null);
    }
  };

  const columns = [
    {
      header: "",
      accessor: () => <GripVertical size={16} className="text-muted-foreground cursor-grab" />,
      className: "w-10 text-center",
    },
    {
      header: "Item Details",
      accessor: (row: any) => (
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 bg-white/5">
            {row.imageUrl ? (
              <img src={row.imageUrl} alt={row.name} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(ellipse_at_center,rgba(201,162,39,0.2),transparent_70%)]" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium text-foreground">{row.name}</p>
              {row.isVeg ? (
                <span className="flex h-3 w-3 items-center justify-center rounded-sm border border-green-500 p-0.5">
                  <span className="h-full w-full rounded-full bg-green-500" />
                </span>
              ) : (
                <span className="flex h-3 w-3 items-center justify-center rounded-sm border border-red-500 p-0.5">
                  <span className="h-full w-full rounded-full bg-red-500" />
                </span>
              )}
            </div>
            {row.description && <p className="mt-1 text-xs text-muted-foreground truncate max-w-sm">{row.description}</p>}
          </div>
        </div>
      ),
    },
    {
      header: "Price",
      accessor: (row: any) => (
        <span className="font-display text-lg text-gold tabular-nums">
          ₹{row.price}
        </span>
      ),
    },
    {
      header: "Status",
      accessor: (row: any) => (
        <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${row.isAvailable ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
          {row.isAvailable ? 'Available' : 'Out of Stock'}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (row: any) => (
        <div className="flex items-center gap-2">
          <button 
            onClick={() => handleToggle(row.id)}
            disabled={togglingId === row.id}
            className={`flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 transition-colors ${row.isAvailable ? 'bg-white/5 text-muted-foreground hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30' : 'bg-red-500/10 text-red-500 border-red-500/30 hover:bg-green-500/10 hover:text-green-500 hover:border-green-500/30'}`}
            title={row.isAvailable ? "Mark Out of Stock" : "Mark Available"}
          >
            {togglingId === row.id ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <Power size={14} />
            )}
          </button>
          <button 
            onClick={() => setEditingItem(row)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground transition-colors"
            title="Edit Item"
          >
            <Edit2 size={14} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <AdminHeader title="Menu Management" />
      <div className="flex-1 p-8">
        
        {/* Categories Tab Bar */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex flex-1 overflow-x-auto pb-2 scrollbar-hide gap-2">
            <button
              onClick={() => setActiveCategory(null)}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all ${
                activeCategory === null
                  ? "border-gold bg-gold text-primary-foreground"
                  : "border-white/10 bg-white/5 text-muted-foreground hover:border-gold/40 hover:text-gold"
              }`}
            >
              All Items
            </button>
            {categories?.map((cat: any) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all ${
                  activeCategory === cat.id
                    ? "border-gold bg-gold text-primary-foreground"
                    : "border-white/10 bg-white/5 text-muted-foreground hover:border-gold/40 hover:text-gold"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className="ml-4 flex items-center gap-3 shrink-0">
            <button 
              onClick={() => setIsCategoryModalOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground hover:border-gold/50 hover:text-gold transition-colors"
            >
              <Plus size={16} /> Category
            </button>
            <button 
              onClick={() => setIsItemModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-gold px-4 py-2 text-xs font-bold uppercase tracking-wider text-primary-foreground hover:bg-gold/90 transition-colors"
            >
              <Plus size={16} /> Item
            </button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={items || []}
          isLoading={isLoadingCats || isLoadingItems}
          emptyState="No menu items found."
        />
        
        <CreateCategoryModal 
          open={isCategoryModalOpen} 
          onOpenChange={setIsCategoryModalOpen} 
          onSuccess={() => {
            refetch(); // This technically refetches items, we might need a way to refetch categories... 
            // In TanStack Query we'd ideally use queryClient.invalidateQueries, but refetching window works.
            window.location.reload(); 
          }} 
        />
        
        <CreateItemModal 
          open={isItemModalOpen} 
          onOpenChange={setIsItemModalOpen} 
          onSuccess={() => refetch()} 
          categories={categories || []}
          defaultCategoryId={activeCategory || undefined}
        />
        
        <EditItemModal 
          open={!!editingItem} 
          onOpenChange={(val) => !val && setEditingItem(null)} 
          onSuccess={() => {
            setEditingItem(null);
            refetch();
          }} 
          categories={categories || []}
          item={editingItem}
        />
      </div>
    </>
  );
}
