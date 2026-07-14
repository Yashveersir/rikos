import { Link } from "@tanstack/react-router";
import { FileQuestion, Home } from "lucide-react";

export function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.1),transparent_50%)]" />
      
      <div className="relative w-full max-w-lg rounded-3xl border border-white/5 bg-white/[0.02] p-8 text-center glass-card">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-muted-foreground border border-white/10">
          <FileQuestion size={32} />
        </div>
        
        <h1 className="font-display text-4xl tracking-widest gold-gradient-text mb-2">404</h1>
        <h2 className="font-display text-2xl text-foreground mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <div className="flex items-center justify-center">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl bg-gold px-8 py-3 text-sm font-bold uppercase tracking-wider text-primary-foreground hover:bg-gold/90 transition-all"
          >
            <Home size={18} />
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}
