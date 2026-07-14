import { useState } from "react";
import { subscribeNewsletter } from "@/api/newsletter";
import { Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const res = await subscribeNewsletter({ data: { email, source: "footer" } });
      if (res.success) {
        if (res.alreadySubscribed) {
          toast.info("You're already subscribed!");
        } else {
          toast.success("Thanks for subscribing!");
        }
        setEmail("");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to subscribe. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-sm">
      <p className="mb-3 text-[10px] uppercase tracking-[0.3em] text-gold">Join our Newsletter</p>
      <div className="relative flex items-center">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email Address for Newsletter"
          placeholder="Enter your email"
          className="h-10 w-full rounded-full border border-white/10 bg-white/5 pl-4 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          aria-label="Subscribe to Newsletter"
          className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-gold text-primary-foreground transition-transform hover:scale-105 disabled:opacity-70 disabled:hover:scale-100"
        >
          {isSubmitting ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <ArrowRight size={14} />
          )}
        </button>
      </div>
    </form>
  );
}
