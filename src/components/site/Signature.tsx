import { motion } from "framer-motion";
import { Reveal, SectionEyebrow } from "./Reveal";
import indian from "@/assets/dish-indian.jpg";
import chinese from "@/assets/dish-chinese.jpg";
import tandoor from "@/assets/dish-tandoor.jpg";
import mocktail from "@/assets/dish-mocktail.jpg";

const cards = [
  { img: indian, title: "Indian Cuisine", desc: "Slow-cooked richness rooted in tradition." },
  { img: chinese, title: "Chinese Cuisine", desc: "Bold wok fire, silky finishes." },
  { img: tandoor, title: "Tandoor", desc: "Live-fire char, ancient technique." },
  { img: mocktail, title: "Mocktails", desc: "Crystal glass, layered flavor." },
];

export function Signature({ settings }: { settings?: Record<string, string> }) {
  const signatureTitle = settings?.signature_title || "Four flavors, one destination.";
  
  // Split title by comma if possible
  const titleParts = signatureTitle.includes(',') 
    ? signatureTitle.split(',').map(p => p.trim() + ',') 
    : [signatureTitle];
  // Remove the trailing comma from the last part
  if (titleParts.length > 1) {
    titleParts[titleParts.length - 1] = titleParts[titleParts.length - 1].slice(0, -1);
  }

  return (
    <section className="relative py-32 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal>
            <SectionEyebrow>Signature Experience</SectionEyebrow>
            <h2 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              {titleParts.map((part, i) => (
                <span key={i} className={i === 1 ? "gold-gradient-text italic" : ""}>
                  {part}{i === 0 && titleParts.length > 1 ? " " : ""}
                </span>
              ))}
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-card"
            >
              <div className="relative h-[420px] overflow-hidden">
                <img loading="lazy" decoding="async"
                  src={c.img}
                  alt={c.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="mb-3 h-px w-8 bg-gold transition-all duration-500 group-hover:w-16" />
                <h3 className="font-display text-3xl">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}