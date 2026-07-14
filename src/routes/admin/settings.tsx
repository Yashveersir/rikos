import { useState, useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { adminGetSettings, adminSaveSettings } from "@/api/settings";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => adminGetSettings(),
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await adminSaveSettings({ data: formData });
      if (res.success) {
        toast.success("Settings saved successfully");
      } else {
        toast.error(res.error || "Failed to save settings");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <AdminHeader title="Platform Settings" />
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="animate-spin text-gold" size={32} />
        </div>
      </>
    );
  }

  return (
    <>
      <AdminHeader title="Platform Settings" />
      <div className="flex-1 p-8">
        
        <div className="mx-auto max-w-4xl space-y-8">
          
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 glass-card">
            <h3 className="font-display text-2xl text-gold mb-6">General Information</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={formData["restaurant_name"] || ""}
                  onChange={(e) => handleChange("restaurant_name", e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={formData["restaurant_phone"] || ""}
                  onChange={(e) => handleChange("restaurant_phone", e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData["restaurant_email"] || ""}
                  onChange={(e) => handleChange("restaurant_email", e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Address
                </label>
                <textarea
                  rows={3}
                  value={formData["restaurant_address"] || ""}
                  onChange={(e) => handleChange("restaurant_address", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all resize-none"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Opening Hours
                </label>
                <input
                  type="text"
                  value={formData["opening_hours"] || ""}
                  onChange={(e) => handleChange("opening_hours", e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 glass-card">
            <h3 className="font-display text-2xl text-gold mb-6">Website Content</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Hero Title
                </label>
                <input
                  type="text"
                  value={formData["hero_title"] || ""}
                  onChange={(e) => handleChange("hero_title", e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
                />
                <p className="mt-2 text-xs text-muted-foreground">Separate parts with a period (.) to create stacked text effect.</p>
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Hero Subtitle
                </label>
                <textarea
                  rows={2}
                  value={formData["hero_subtitle"] || ""}
                  onChange={(e) => handleChange("hero_subtitle", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all resize-none"
                />
              </div>
              <div className="md:col-span-2 border-t border-white/5 pt-6 mt-2">
                <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  About Section Heading
                </label>
                <input
                  type="text"
                  value={formData["about_heading"] || ""}
                  onChange={(e) => handleChange("about_heading", e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  About Section Text
                </label>
                <textarea
                  rows={4}
                  value={formData["about_text"] || ""}
                  onChange={(e) => handleChange("about_text", e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all resize-none"
                />
              </div>
              <div className="border-t border-white/5 pt-6 mt-2">
                <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Signature Section Title
                </label>
                <input
                  type="text"
                  value={formData["signature_title"] || ""}
                  onChange={(e) => handleChange("signature_title", e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
                />
                <p className="mt-2 text-xs text-muted-foreground">Separate parts with a comma (,) for styling.</p>
              </div>
              <div className="border-t border-white/5 pt-6 mt-2">
                <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Features Section Title
                </label>
                <input
                  type="text"
                  value={formData["features_title"] || ""}
                  onChange={(e) => handleChange("features_title", e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
                />
                <p className="mt-2 text-xs text-muted-foreground">The last word will be styled in gold.</p>
              </div>
              <div className="md:col-span-2 border-t border-white/5 pt-6 mt-2">
                <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Footer Tagline
                </label>
                <input
                  type="text"
                  value={formData["footer_tagline"] || ""}
                  onChange={(e) => handleChange("footer_tagline", e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 glass-card">
            <h3 className="font-display text-2xl text-gold mb-6">Social Links</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={formData["instagram_url"] || ""}
                  onChange={(e) => handleChange("instagram_url", e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
                />
              </div>
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={formData["facebook_url"] || ""}
                  onChange={(e) => handleChange("facebook_url", e.target.value)}
                  className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-gold px-8 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-gold/90 transition-all disabled:opacity-70"
            >
              {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              Save Changes
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
