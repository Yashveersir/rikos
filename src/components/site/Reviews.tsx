import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Reveal, SectionEyebrow } from "./Reveal";

const reviews = [
  {
    name: "Ananya R.",
    role: "Google Review",
    text:
      "The ambience is straight out of a movie — golden lights, brick walls, and food that lives up to the setting. The butter chicken here is unmatched in Burdwan.",
  },
  {
    name: "Debojit S.",
    role: "Google Review",
    text:
      "Took my parents for their anniversary. Service, plating, mocktails — all top tier. Feels like a five-star, priced like a restro-lounge.",
  },
  {
    name: "Priya M.",
    role: "Google Review",
    text:
      "Every corner is Instagram gold. The neon wall + green wall combo is stunning. Tandoori platter was smoky, juicy perfection.",
  },
  {
    name: "Rahul K.",
    role: "Google Review",
    text:
      "Best rooftop dining experience in town. The staff remembers you. The kitchen surprises you. We're now regulars.",
  },
];

export function Reviews() {
  return (
    <section id="reviews" className="relative overflow-hidden py-32 scroll-mt-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(201,162,39,0.08),transparent_60%)]" />

      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <Reveal>
              <SectionEyebrow>Guest Reviews</SectionEyebrow>
              <h2 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
                Loved by the <span className="gold-gradient-text italic">city</span>.
              </h2>
            </Reveal>
          </div>
          <Reveal delay={1}>
            <div className="flex items-center gap-4 rounded-2xl border border-gold/30 bg-gold/5 px-5 py-4 backdrop-blur-md">
              <div>
                <div className="flex items-center gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                  ))}
                </div>
                <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  4.8 · Google Rated
                </p>
              </div>
              <div className="font-display text-5xl gold-gradient-text">4.8</div>
            </div>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="relative rounded-3xl glass-card p-8"
            >
              <Quote size={32} className="text-gold/40" strokeWidth={1.5} />
              <p className="mt-6 text-lg leading-relaxed text-foreground/90">
                {r.text}
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold to-wine font-display text-lg text-primary-foreground">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium">{r.name}</div>
                  <div className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    {r.role}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}