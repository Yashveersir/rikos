import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { adminGetGallery, adminUpdateGalleryImage, adminDeleteGalleryImage, adminAddGalleryImage } from "@/api/gallery";
import { adminUploadFile } from "@/api/storage";
import { Plus, Power, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/gallery")({
  component: AdminGallery,
});

function AdminGallery() {
  const [isUploading, setIsUploading] = useState(false);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  const { data: images, isLoading, refetch } = useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: () => adminGetGallery(),
  });

  const handleUploadImage = async (file: File) => {
    try {
      // 1. Upload to Supabase Storage via our secure API
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "gallery");
      
      const uploadRes = await adminUploadFile({ data: formData as any }); // type override for FormData
      if (!uploadRes.success) throw new Error("Upload failed");
      
      const uploadedUrl = uploadRes.url;

      // 2. Save the URL to the database
      const saveRes = await adminAddGalleryImage({ data: { url: uploadedUrl, alt: file.name } });
      if (!saveRes.success) throw new Error(saveRes.error);
      toast.success("Image uploaded to gallery");
      refetch();
      return uploadedUrl;
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
      throw err;
    }
  };

  const handleToggle = async (id: string, currentIsActive: boolean) => {
    setActiveActionId(id);
    try {
      const res = await adminUpdateGalleryImage({ data: { id, isActive: !currentIsActive } });
      if (!res.success) throw new Error(res.error);
      toast.success("Image status updated");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to update image");
    } finally {
      setActiveActionId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    
    setActiveActionId(id);
    try {
      const res = await adminDeleteGalleryImage({ data: { id } });
      if (!res.success) throw new Error(res.error);
      toast.success("Image deleted");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete image");
    } finally {
      setActiveActionId(null);
    }
  };

  return (
    <>
      <AdminHeader title="Gallery Management" />
      <div className="flex-1 p-8">
        
        <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 glass-card">
            <h3 className="font-display text-lg text-foreground mb-4">Upload New Image</h3>
            <ImageUpload onUpload={handleUploadImage} />
          </div>
          
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 glass-card md:col-span-1 lg:col-span-2 flex flex-col justify-center items-center text-center">
            <h3 className="font-display text-2xl text-gold mb-2">Gallery Overview</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              Images here are displayed on the public gallery page. You can toggle their visibility or delete them completely.
            </p>
            <div className="mt-6 flex gap-8 text-sm">
              <div>
                <span className="block font-display text-3xl text-foreground">{images?.length || 0}</span>
                <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Total Images</span>
              </div>
              <div>
                <span className="block font-display text-3xl text-green-500">{images?.filter((i: any) => i.isActive).length || 0}</span>
                <span className="text-muted-foreground uppercase tracking-widest text-[10px]">Active</span>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center rounded-2xl border border-white/5 bg-white/[0.02]">
            <Loader2 className="animate-spin text-gold" size={32} />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {images?.map((img: any) => (
              <div key={img.id} className={`group relative aspect-square overflow-hidden rounded-2xl border ${img.isActive ? 'border-white/10' : 'border-red-500/30 opacity-60'}`}>
                <img src={img.url} alt={img.alt} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
                  <button
                    onClick={() => handleToggle(img.id, img.isActive)}
                    disabled={activeActionId === img.id}
                    className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-medium uppercase tracking-wider transition-all ${
                      img.isActive 
                        ? 'border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white' 
                        : 'border-green-500/30 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white'
                    }`}
                  >
                    {activeActionId === img.id ? <Loader2 className="animate-spin" size={14} /> : <Power size={14} />}
                    {img.isActive ? 'Hide' : 'Show'}
                  </button>
                  
                  <button
                    onClick={() => handleDelete(img.id)}
                    disabled={activeActionId === img.id}
                    className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-medium uppercase tracking-wider text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
                
                {!img.isActive && (
                  <div className="absolute left-3 top-3 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    Hidden
                  </div>
                )}
              </div>
            ))}
            
            {images?.length === 0 && (
              <div className="col-span-full py-12 text-center text-muted-foreground">
                No images found in the gallery. Upload some above!
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
