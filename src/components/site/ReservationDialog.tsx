import { useState, useEffect } from "react";
import { submitReservation } from "@/api/reservation";
import { Loader2, Calendar as CalendarIcon, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function ReservationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === "#reserve") {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  const closeDialog = () => {
    window.history.pushState(null, "", window.location.pathname + window.location.search);
    setIsOpen(false);
    // Reset success state after animation finishes
    setTimeout(() => setIsSuccess(false), 500);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      guests: Number(formData.get("guests")),
      occasion: formData.get("occasion") as any,
      specialRequests: formData.get("specialRequests") as string,
    };

    try {
      const res = await submitReservation({ data });
      if (res.success) {
        setIsSuccess(true);
      }
    } catch (err: any) {
      console.error("Reservation Error:", err); toast.error(err.message || "Failed to submit reservation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
            onClick={closeDialog}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 z-[101] w-full max-w-lg -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-3xl border border-white/10 bg-card p-0 shadow-2xl"
          >
            <div className="relative h-32 overflow-hidden bg-background">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.3),transparent_70%)]" />
              <button
                onClick={closeDialog}
                className="absolute right-4 top-4 rounded-full bg-black/20 p-2 text-white/70 hover:bg-black/40 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
              <div className="absolute bottom-6 left-8">
                <p className="text-[10px] uppercase tracking-[0.4em] text-gold">Experience Riko's</p>
                <h2 className="mt-1 font-display text-3xl">Reserve a Table</h2>
              </div>
            </div>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center p-12 text-center"
              >
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 text-green-500 ring-1 ring-green-500/20">
                  <CalendarIcon size={32} />
                </div>
                <h3 className="mb-2 font-display text-3xl">Request Received</h3>
                <p className="mb-8 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  Thank you! We've received your reservation request and sent you a confirmation email. We'll be in touch shortly to finalize your booking.
                </p>
                <button
                  onClick={closeDialog}
                  className="rounded-xl bg-white/10 px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  <input required name="name" placeholder="Full Name" className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all" />
                  <input required type="email" name="email" placeholder="Email Address" className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all" />
                  <input required name="phone" placeholder="Phone Number" className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all" />
                  <input required type="number" name="guests" min="1" max="20" placeholder="Number of Guests" className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all" />
                  <input required type="date" name="date" className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all [color-scheme:dark]" />
                  <input required type="time" name="time" className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all [color-scheme:dark]" />
                </div>

                <div className="mt-4">
                  <select name="occasion" className="h-11 w-full rounded-xl border border-white/10 bg-[#161616] px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all">
                    <option value="CASUAL">Casual Dining</option>
                    <option value="BIRTHDAY">Birthday</option>
                    <option value="ANNIVERSARY">Anniversary</option>
                    <option value="DATE_NIGHT">Date Night</option>
                    <option value="CORPORATE">Corporate Event</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <div className="mt-4">
                  <textarea name="specialRequests" placeholder="Special Requests (Optional)" rows={3} className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all" />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gold px-6 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-gold/90 disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <CalendarIcon size={18} />
                  )}
                  Confirm Request
                </button>
              </form>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
