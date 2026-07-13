import {
  Sparkles,
  Sofa,
  Users,
  Soup,
  Flame,
  GlassWater,
  Utensils,
  Camera,
  ConciergeBell,
} from "lucide-react";
import { Reveal, SectionEyebrow } from "./Reveal";

const items = [
  { icon: Sparkles, title: "Premium Dining", desc: "Curated menus, plated with intent." },
  { icon: Sofa, title: "Luxury Interiors", desc: "Wood, brick, velvet and warm gold light." },
  { icon: Users, title: "Family Restaurant", desc: "Every table has room for everyone." },
  { icon: Soup, title: "Chinese Cuisine", desc: "Wok-tossed classics, elevated." },
  { icon: Utensils, title: "Indian Cuisine", desc: "Bold flavors, refined presentation." },
  { icon: Flame, title: "Tandoor", desc: "Charred, smoky, unforgettable." },
  { icon: GlassWater, title: "Signature Mocktails", desc: "Crafted at our lounge bar." },
  { icon: ConciergeBell, title: "Attentive Service", desc: "Trained hospitality, always." },
  { icon: Camera, title: "Instagram-worthy", desc: "Every corner a frame." },
];

export function Features() {
  return (
    <section className="relative py-32 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <Reveal>
            <SectionEyebrow>Why Riko&apos;s</SectionEyebrow>
            <h2 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              Nine reasons Burdwan calls this{" "}
              <span className="gold-gradient-text italic">home</span>.
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i % 3}>
              <div className="group relative h-full overflow-hidden rounded-2xl glass-card p-8 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40">
                <div className="absolute -top-20 -right-20 h-40 w-40 rounded-full bg-gold/0 blur-3xl transition-all duration-500 group-hover:bg-gold/20" />
                <div className="relative">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
                    <it.icon size={22} strokeWidth={1.5} />
                  </div>
                  <h3 className="mt-6 font-display text-2xl">{it.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {it.desc}
                  </p>
                </div>
                <div className="mt-8 hairline w-full opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}