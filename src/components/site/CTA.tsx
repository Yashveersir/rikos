import { motion } from "framer-motion";
import { Phone, Calendar } from "lucide-react";
import hero from "@/assets/hero.jpg";

export function CTA() {
  return (
    <section className="relative overflow-hidden py-32 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[2rem] border border-gold/20"
        >
          <img
            src={hero}
            alt="Riko's interior"
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/50" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,rgba(201,162,39,0.2),transparent_60%)]" />

          <div className="relative grid gap-10 p-10 md:grid-cols-[1.4fr_1fr] md:p-16 lg:p-20">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-gold">Reservations Open</p>
              <h2 className="mt-4 font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
                Reserve your <span className="gold-gradient-text italic">perfect</span> evening.
              </h2>
              <p className="mt-6 max-w-lg text-lg text-muted-foreground">
                Weekends fill fast. Secure your table for that celebration
                you&apos;ve been planning — or just because tonight deserves
                more than ordinary.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-4">
              <a
                href="#reserve"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-gold px-8 py-4 text-xs font-medium uppercase tracking-[0.25em] text-primary-foreground transition-all hover:gold-glow"
              >
                <Calendar size={16} />
                Reserve Table
              </a>
              <a
                href="tel:+910000000000"
                className="group inline-flex items-center justify-center gap-3 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-xs font-medium uppercase tracking-[0.25em] text-foreground backdrop-blur-md transition-all hover:border-gold/60 hover:text-gold"
              >
                <Phone size={16} />
                Call Now
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}