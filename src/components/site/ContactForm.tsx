import { useState } from "react";
import { submitContact } from "@/api/contact";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await submitContact({ data });
      if (res.success) {
        toast.success("Message sent! We'll get back to you soon.");
        (e.target as HTMLFormElement).reset();
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-2xl glass-card p-6">
      <div className="mb-2">
        <h3 className="font-display text-2xl text-gold">Send a Message</h3>
        <p className="text-xs text-muted-foreground mt-1">Have a special request? Let us know.</p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          required
          name="name"
          placeholder="Your Name"
          className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
        />
        <input
          required
          type="email"
          name="email"
          placeholder="Email Address"
          className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
        />
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2">
        <input
          name="phone"
          placeholder="Phone (optional)"
          className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
        />
        <input
          name="subject"
          placeholder="Subject (optional)"
          className="h-11 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all"
        />
      </div>

      <textarea
        required
        name="message"
        placeholder="Your Message..."
        rows={3}
        className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold/50 focus:outline-none focus:ring-1 focus:ring-gold/50 transition-all resize-none"
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:bg-gold/90 disabled:opacity-70"
      >
        {isSubmitting ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Send size={16} className="transition-transform group-hover:translate-x-1" />
        )}
        Send Message
      </button>
    </form>
  );
}
