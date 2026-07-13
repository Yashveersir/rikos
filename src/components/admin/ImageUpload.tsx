import { useState, useRef } from "react";
import { UploadCloud, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface ImageUploadProps {
  onUpload: (file: File) => Promise<string>;
  defaultUrl?: string;
  className?: string;
}

export function ImageUpload({ onUpload, defaultUrl, className = "" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaultUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be smaller than 5MB");
      return;
    }

    setIsUploading(true);
    try {
      // Show local preview immediately
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
      
      const uploadedUrl = await onUpload(file);
      setPreview(uploadedUrl);
    } catch (err) {
      setPreview(defaultUrl || null);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={`relative ${className}`}>
      {preview ? (
        <div className="relative overflow-hidden rounded-xl border border-white/10 group aspect-video">
          <img src={preview} alt="Upload preview" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center gap-2 rounded-lg bg-red-500/80 px-4 py-2 text-sm font-medium text-white hover:bg-red-500"
            >
              <X size={16} /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/20 bg-white/[0.02] transition-colors hover:border-gold/50 hover:bg-white/5 disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="animate-spin text-gold" size={32} />
          ) : (
            <>
              <UploadCloud size={32} className="text-muted-foreground" />
              <div className="text-center text-sm">
                <span className="font-medium text-gold">Click to upload</span> or drag and drop
                <p className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
              </div>
            </>
          )}
        </button>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
