import { useState, useEffect } from "react";
import { submitReservation } from "@/api/reservation";
import { Loader2, Calendar as CalendarIcon, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createReservationSchema, CreateReservationInput } from "@/lib/validators/reservation";

export function ReservationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<CreateReservationInput>({
    resolver: zodResolver(createReservationSchema),
    defaultValues: {
      occasion: "CASUAL"
    }
  });

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
    setTimeout(() => {
      setIsSuccess(false);
      reset();
    }, 500);
  };

  const onSubmit = async (data: CreateReservationInput) => {
    try {
      const res = await submitReservation({ data });
      if (res.success) {
        setIsSuccess(true);
      } else {
        toast.error(res.error || "Failed to submit reservation. Please try again.");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to submit reservation. Please try again.");
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
                aria-label="Close reservation dialog"
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
                  aria-label="Close confirmation"
                  className="rounded-xl bg-white/10 px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-white/20 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <input {...register("name")} aria-label="Full Name" placeholder="Full Name" className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all" />
                    {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
                  </div>
                  <div>
                    <input {...register("email")} aria-label="Email Address" type="email" placeholder="Email Address" className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all" />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
                  </div>
                  <div>
                    <input {...register("phone")} aria-label="Phone Number" placeholder="Phone Number" className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all" />
                    {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
                  </div>
                  <div>
                    <input {...register("guests", { valueAsNumber: true })} aria-label="Number of Guests" type="number" min="1" max="20" placeholder="Number of Guests" className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all" />
                    {errors.guests && <p className="mt-1 text-xs text-red-500">{errors.guests.message}</p>}
                  </div>
                  <div>
                    <input {...register("date")} aria-label="Reservation Date" type="date" className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all [color-scheme:dark]" />
                    {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date.message}</p>}
                  </div>
                  <div>
                    <input {...register("time")} aria-label="Reservation Time" type="time" className="h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all [color-scheme:dark]" />
                    {errors.time && <p className="mt-1 text-xs text-red-500">{errors.time.message}</p>}
                  </div>
                </div>

                <div className="mt-4">
                  <select {...register("occasion")} aria-label="Occasion" className="h-11 w-full rounded-xl border border-white/10 bg-[#161616] px-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all">
                    <option value="CASUAL">Casual Dining</option>
                    <option value="BIRTHDAY">Birthday</option>
                    <option value="ANNIVERSARY">Anniversary</option>
                    <option value="DATE_NIGHT">Date Night</option>
                    <option value="CORPORATE">Corporate Event</option>
                    <option value="OTHER">Other</option>
                  </select>
                  {errors.occasion && <p className="mt-1 text-xs text-red-500">{errors.occasion.message}</p>}
                </div>

                <div className="mt-4">
                  <textarea {...register("specialRequests")} aria-label="Special Requests" placeholder="Special Requests (Optional)" rows={3} className="w-full resize-none rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all" />
                  {errors.specialRequests && <p className="mt-1 text-xs text-red-500">{errors.specialRequests.message}</p>}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-label="Submit reservation request"
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
