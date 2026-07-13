import { Reveal, SectionEyebrow } from "./Reveal";
import { motion } from "framer-motion";
import panorama from "@/assets/rikos-panorama.webp.asset.json";
import wings from "@/assets/rikos-wings.webp.asset.json";
import neonGreen from "@/assets/rikos-neon-green.webp.asset.json";
import windowSeat from "@/assets/rikos-window-seating.webp.asset.json";
const interior1 = panorama.url;
const interior2 = wings.url;
const gallery1 = neonGreen.url;
const gallery2 = windowSeat.url;

const stats = [
  { value: "150+", label: "Signature Dishes" },
  { value: "4.8", label: "Google Rating" },
  { value: "5F", label: "Rooftop Lounge" },
];

export function About() {
  return (
    <section id="about" className="relative py-32 scroll-mt-24">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2 lg:items-center">
        <div className="relative order-2 lg:order-1">
          <div className="grid grid-cols-6 grid-rows-6 gap-4 h-[560px]">
            <motion.img
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              src={interior1}
              alt="Green wall dining"
              loading="lazy"
              className="col-span-4 row-span-4 h-full w-full rounded-2xl object-cover shadow-2xl"
            />
            <motion.img
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.15 }}
              src={interior2}
              alt="Neon sign"
              loading="lazy"
              className="col-span-2 row-span-4 col-start-5 h-full w-full rounded-2xl object-cover shadow-2xl"
            />
            <motion.img
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.3 }}
              src={gallery1}
              alt="Elegant table setup"
              loading="lazy"
              className="col-span-3 row-span-2 col-start-1 row-start-5 h-full w-full rounded-2xl object-cover shadow-2xl"
            />
            <motion.img
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.45 }}
              src={gallery2}
              alt="Window-side seating with city light"
              loading="lazy"
              className="col-span-3 row-span-2 col-start-4 row-start-5 h-full w-full rounded-2xl object-cover shadow-2xl"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-gold/20 blur-3xl" />
        </div>

        <div className="order-1 lg:order-2">
          <Reveal>
            <SectionEyebrow>Our Story</SectionEyebrow>
            <h2 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              An address for the <span className="gold-gradient-text italic">unforgettable</span>.
            </h2>
          </Reveal>

          <Reveal delay={1}>
            <p className="mt-8 text-lg leading-relaxed text-muted-foreground">
              Riko&apos;s is Burdwan&apos;s answer to modern luxury dining — a
              restro-lounge crafted around warm timber, brick and gold. From the
              first sip of a signature mocktail to the last note of a
              slow-cooked biryani, every moment is designed to feel like a
              celebration.
            </p>
          </Reveal>

          <Reveal delay={2}>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Whether it&apos;s an intimate evening, a family gathering, or a
              spontaneous night out with friends — this is where the city comes
              to be seen and to savor.
            </p>
          </Reveal>

          <Reveal delay={3}>
            <div className="mt-12 grid grid-cols-3 gap-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm"
                >
                  <div className="font-display text-4xl gold-gradient-text">{s.value}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}