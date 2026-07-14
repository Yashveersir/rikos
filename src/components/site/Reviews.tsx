import { motion } from "framer-motion";
import { Star, Quote, Edit3 } from "lucide-react";
import { Reveal, SectionEyebrow } from "./Reveal";
import { WriteReviewModal } from "./WriteReviewModal";

const staticReviews = [
  {
    name: "Ananya R.",
    role: "Google Review",
    text:
      "The ambience is straight out of a movie — golden lights, brick walls, and food that lives up to the setting. The butter chicken here is unmatched in Burdwan.",
    rating: 5,
  },
  {
    name: "Debojit S.",
    role: "Google Review",
    text:
      "Took my parents for their anniversary. Service, plating, mocktails — all top tier. Feels like a five-star, priced like a restro-lounge.",
    rating: 5,
  },
  {
    name: "Priya M.",
    role: "Google Review",
    text:
      "Every corner is Instagram gold. The neon wall + green wall combo is stunning. Tandoori platter was smoky, juicy perfection.",
    rating: 5,
  },
  {
    name: "Rahul K.",
    role: "Google Review",
    text:
      "Best rooftop dining experience in town. The staff remembers you. The kitchen surprises you. We're now regulars.",
    rating: 5,
  },
];

export function Reviews({ reviewsData }: { reviewsData?: any }) {
  const dbReviews = reviewsData?.success && reviewsData?.data ? reviewsData.data : [];
  const mappedDbReviews = dbReviews.map((r: any) => ({
    name: r.name,
    role: r.source === "website" ? "Website Guest" : "Guest Review",
    text: r.content,
    rating: r.rating || 5,
  }));

  const allReviews = [...mappedDbReviews, ...staticReviews].slice(0, 6);

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
          <div className="flex flex-wrap items-center gap-4">
            <Reveal delay={0.5}>
              <WriteReviewModal>
                <button className="flex items-center gap-2 rounded-2xl border border-gold/30 bg-gold/10 px-5 py-4 text-sm font-bold uppercase tracking-wider text-gold hover:bg-gold hover:text-primary-foreground hover:gold-glow transition-all">
                  <Edit3 size={16} />
                  Write a Review
                </button>
              </WriteReviewModal>
            </Reveal>
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
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {allReviews.map((r, i) => (
            <motion.div
              key={`${r.name}-${i}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="relative rounded-3xl glass-card p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start">
                  <Quote size={32} className="text-gold/40" strokeWidth={1.5} />
                  <div className="flex gap-0.5 text-gold">
                    {Array.from({ length: r.rating }).map((_, idx) => (
                      <Star key={idx} size={12} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                </div>
                <p className="mt-6 text-base leading-relaxed text-foreground/90 italic">
                  "{r.text}"
                </p>
              </div>
              <div className="mt-8 flex items-center gap-4 border-t border-white/5 pt-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-gold to-wine font-display text-lg text-primary-foreground">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-foreground">{r.name}</div>
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