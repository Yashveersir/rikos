import { useState } from "react";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { adminLogin } from "@/api/auth";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const res = await adminLogin({ data: { email, password } });
      if (res.success) {
        toast.success("Welcome back!");
        // We use window.location here to ensure the full page reload 
        // to pick up the new http-only cookies for SSR properly
        window.location.href = "/admin";
      } else {
        toast.error(res.error || "Invalid credentials");
      }
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.15),transparent_50%)]" />
      
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-card/50 p-8 backdrop-blur-xl glass-card">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gold/10 text-gold border border-gold/30">
            <Lock size={28} />
          </div>
          <h1 className="font-display text-3xl tracking-widest gold-gradient-text">RIKO'S</h1>
          <p className="mt-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="grid gap-5">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
            />
          </div>
          
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gold text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-gold/90 disabled:opacity-70"
          >
            {isSubmitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
