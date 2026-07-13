import { motion } from "framer-motion";
import { Reveal, SectionEyebrow } from "./Reveal";
import mainHall from "@/assets/rikos-main-hall.webp.asset.json";
import panorama from "@/assets/rikos-panorama.webp.asset.json";
import neonGreen from "@/assets/rikos-neon-green.webp.asset.json";
import neonBrick from "@/assets/rikos-neon-brick.webp.asset.json";
import windowSeat from "@/assets/rikos-window-seating.webp.asset.json";
import wings from "@/assets/rikos-wings.webp.asset.json";
import d1 from "@/assets/dish-indian.jpg";
import d2 from "@/assets/dish-mocktail.jpg";
import { Route } from "@/routes/index";

const items = [
  { src: mainHall.url, alt: "Riko's main dining hall with signature ceiling", span: "row-span-2" },
  { src: neonGreen.url, alt: "'Let's Get Social' neon on green wall", span: "" },
  { src: wings.url, alt: "Neon wings art installation", span: "" },
  { src: panorama.url, alt: "Panoramic view of the restro-lounge", span: "row-span-2" },
  { src: d1, alt: "Indian dish plating", span: "" },
  { src: neonBrick.url, alt: "Neon quote on exposed brick wall", span: "" },
  { src: windowSeat.url, alt: "Window-side seating with city light", span: "" },
  { src: d2, alt: "Signature mocktail", span: "" },
];

export function Gallery() {
  const { galleryData } = Route.useLoaderData();
  const dbItems = galleryData?.length ? galleryData.map((g: any, i: number) => ({
    src: g.url,
    alt: g.alt,
    span: i === 0 || i === 3 ? "row-span-2" : ""
  })) : items;

  return (
    <section id="gallery" className="relative py-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <Reveal>
            <SectionEyebrow>Gallery</SectionEyebrow>
            <h2 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              Every corner, a <span className="gold-gradient-text italic">frame</span>.
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid auto-rows-[240px] grid-cols-2 gap-4 md:grid-cols-4">
          {dbItems.map((it, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: (i % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative overflow-hidden rounded-2xl border border-white/10 ${it.span}`}
            >
              <img
                src={it.src}
                alt={it.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              <div className="absolute inset-x-0 bottom-0 translate-y-4 p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Riko&apos;s</p>
                <p className="mt-1 text-sm">{it.alt}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}