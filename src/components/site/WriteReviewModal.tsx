import { useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { publicSubmitReview } from "@/api/testimonial";
import { useRouter } from "@tanstack/react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface WriteReviewModalProps {
  onSuccess?: () => void;
  children: React.ReactNode;
}

export function WriteReviewModal({ onSuccess, children }: WriteReviewModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !content) {
      toast.error("Please fill in name and review content");
      return;
    }
    if (content.length < 10) {
      toast.error("Review must be at least 10 characters long");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await publicSubmitReview({
        data: {
          name,
          email: email || undefined,
          rating,
          content,
        },
      });

      if (res.success) {
        toast.success("Thank you! Your review has been submitted successfully.");
        setName("");
        setEmail("");
        setContent("");
        setRating(5);
        setOpen(false);
        if (onSuccess) onSuccess();
        // Since we auto-approve in the service for now, let's refresh the data
        router.invalidate();
      } else {
        toast.error(res.error || "Failed to submit review");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-white/10 bg-black/95 text-white backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-gold font-display text-xl">Share Your Experience</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Your Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(null)}
                  className="text-gold hover:scale-110 transition-transform p-1"
                >
                  <Star
                    size={28}
                    fill={star <= (hoverRating ?? rating) ? "currentColor" : "none"}
                    stroke="currentColor"
                    strokeWidth={1.5}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="reviewer-name" className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Full Name
            </label>
            <input
              id="reviewer-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
            />
          </div>

          <div>
            <label htmlFor="reviewer-email" className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Email Address (Optional)
            </label>
            <input
              id="reviewer-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. john@example.com"
              className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-white focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
            />
          </div>

          <div>
            <label htmlFor="reviewer-content" className="mb-2 block text-xs font-medium uppercase tracking-widest text-muted-foreground">
              Review Content
            </label>
            <textarea
              id="reviewer-content"
              required
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your detailed review here..."
              className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-2 text-sm font-medium hover:bg-white/5 text-muted-foreground transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 rounded-xl bg-gold px-6 py-2.5 text-sm font-bold text-primary-foreground hover:bg-gold/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : null}
              Submit Review
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
