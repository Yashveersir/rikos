import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, ChevronDown, UtensilsCrossed } from "lucide-react";
import heroAsset from "@/assets/rikos-main-hall.webp.asset.json";
const hero = heroAsset.url;

export function Hero({ settings }: { settings?: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const heroTitle = settings?.hero_title || "Dine. Celebrate. Experience.";
  const heroSubtitle = settings?.hero_subtitle || "A cinematic restro-lounge on the 5th floor of Regent Star Mall — where fine Indian, Chinese and tandoor cuisine meet an ambience worth remembering.";
  
  // Split title by period or comma for the stacked effect, fallback to single line if no splits
  const titleParts = heroTitle.includes('.') 
    ? heroTitle.split('.').filter(Boolean).map(p => p.trim() + '.') 
    : [heroTitle];

  return (
    <section
      id="home"
      ref={ref}
      className="relative isolate flex min-h-screen items-center justify-center overflow-hidden pt-28 md:pt-24"
    >
      <motion.div style={{ y, scale }} className="absolute inset-0 -z-20">
        <img
          src={hero}
          alt="Riko's Cafe interior"
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/70 via-background/40 to-background" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)]" />

      {/* Floating light orbs */}
      <motion.div
        aria-hidden
        animate={{ y: [0, -20, 0], opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute left-[10%] top-[30%] h-40 w-40 rounded-full bg-gold/20 blur-3xl"
      />
      <motion.div
        aria-hidden
        animate={{ y: [0, 25, 0], opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="pointer-events-none absolute right-[8%] top-[50%] h-56 w-56 rounded-full bg-wine/30 blur-3xl"
      />

      <motion.div style={{ opacity }} className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mx-auto mb-8 inline-flex items-center gap-3 rounded-full border border-gold/30 bg-white/5 px-4 py-1.5 backdrop-blur-md"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
            Burdwan · Est. Luxury Dining
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-6xl leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-[9rem]"
        >
          {titleParts.map((part, i) => (
            <span 
              key={i} 
              className={`block ${i === 1 ? 'gold-gradient-text italic' : ''}`}
            >
              {part}
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="mx-auto mt-8 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          {heroSubtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.1 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#contact"
            className="group inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-xs font-medium uppercase tracking-[0.25em] text-primary-foreground transition-all hover:gold-glow"
          >
            Reserve Table
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </a>
          <a
            href="#menu"
            className="group inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-7 py-3.5 text-xs font-medium uppercase tracking-[0.25em] text-foreground backdrop-blur-md transition-all hover:border-gold/60 hover:text-gold"
          >
            <UtensilsCrossed size={16} />
            Explore Menu
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 text-muted-foreground"
        >
          <span className="text-[10px] uppercase tracking-[0.4em]">Scroll</span>
          <ChevronDown size={16} className="text-gold" />
        </motion.div>
      </motion.div>
    </section>
  );
}