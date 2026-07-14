import { Link } from "@tanstack/react-router";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export function ErrorComponent({ error, reset }: { error: any; reset?: () => void }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.1),transparent_50%)]" />
      
      <div className="relative w-full max-w-lg rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center backdrop-blur-xl">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-500/20 text-red-500">
          <AlertCircle size={32} />
        </div>
        
        <h1 className="font-display text-2xl text-foreground mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-8">
          {error?.message || "An unexpected error occurred while loading this page."}
        </p>

        <div className="flex items-center justify-center gap-4">
          {reset && (
            <button
              onClick={reset}
              className="flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-6 py-3 text-sm font-semibold hover:bg-white/10 hover:text-foreground text-muted-foreground transition-all"
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          )}
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-primary-foreground hover:bg-gold/90 transition-all"
          >
            <Home size={16} />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
