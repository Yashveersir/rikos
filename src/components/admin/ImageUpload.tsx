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

  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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

    // Show local preview immediately, but wait for explicit upload
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setSelectedFile(file);
  };

  const handleUploadClick = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    try {
      const uploadedUrl = await onUpload(selectedFile);
      setPreview(uploadedUrl);
      setSelectedFile(null); // Clear selected file after successful upload
    } catch (err) {
      setPreview(defaultUrl || null);
      setSelectedFile(null);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className={`relative ${className}`}>
      {preview ? (
        <div className="flex flex-col gap-3">
          <div className="relative overflow-hidden rounded-xl border border-white/10 group aspect-video">
            <img src={preview} alt="Upload preview" className="h-full w-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                type="button"
                onClick={handleRemove}
                disabled={isUploading}
                className="flex items-center gap-2 rounded-lg bg-red-500/80 px-4 py-2 text-sm font-medium text-white hover:bg-red-500 disabled:opacity-50"
              >
                <X size={16} /> Remove
              </button>
            </div>
          </div>
          {selectedFile && (
            <button
              type="button"
              onClick={handleUploadClick}
              disabled={isUploading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-4 py-2 text-sm font-bold text-primary-foreground hover:bg-gold/90 transition-all disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="animate-spin" size={16} /> : <UploadCloud size={16} />}
              {isUploading ? "Uploading..." : "Confirm Upload"}
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="flex aspect-video w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-white/20 bg-white/[0.02] transition-colors hover:border-gold/50 hover:bg-white/5 disabled:opacity-50"
        >
          <UploadCloud size={32} className="text-muted-foreground" />
          <div className="text-center text-sm">
            <span className="font-medium text-gold">Click to upload</span> or drag and drop
            <p className="mt-1 text-xs text-muted-foreground">PNG, JPG up to 5MB</p>
          </div>
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
