import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, SectionEyebrow } from "./Reveal";
import rice from "@/assets/menu-rice.jpg";
import roti from "@/assets/menu-roti.jpg";
import prawn from "@/assets/menu-prawn.jpg";
import fish from "@/assets/menu-fish.jpg";
import chicken from "@/assets/menu-butter-chicken.jpg";
import mutton from "@/assets/menu-mutton.jpg";
import chineseSpec from "@/assets/dish-chinese.jpg";
import chineseStart from "@/assets/menu-chinese-starter.jpg";
import veg from "@/assets/menu-veg.jpg";
import tandoor from "@/assets/dish-tandoor.jpg";
import drinks from "@/assets/menu-drinks.jpg";
import mocktail from "@/assets/dish-mocktail.jpg";
import { Route } from "@/routes/index";

type Item = { name: string; price: string; note?: string };
type Section = {
  id: string;
  group: "Indian" | "Chinese" | "Gravy" | "Tandoor" | "Drinks";
  title: string;
  subtitle?: string;
  img: string;
  items: Item[];
};

const sections: Section[] = [
  {
    id: "rice",
    group: "Indian",
    title: "Rice",
    img: rice,
    items: [
      { name: "Sultani Polao", price: "239" },
      { name: "Kashmiri Polao", price: "289" },
      { name: "Peas Polao", price: "209" },
      { name: "Jeera Rice", price: "179" },
      { name: "Steamed Rice", price: "99" },
      { name: "Chicken Yakhni Polao", price: "259" },
      { name: "Chicken Biriyani", price: "275" },
      { name: "Mutton Biriyani", price: "325" },
    ],
  },
  {
    id: "roti",
    group: "Indian",
    title: "Roti & Naan",
    img: roti,
    items: [
      { name: "Tandoor Roti", price: "35 / 45", note: "Plain / Butter" },
      { name: "Naan", price: "55 / 65 / 75", note: "Plain / Butter / Garlic" },
      { name: "Keema Naan", price: "225" },
      { name: "Kashmiri Naan", price: "99" },
      { name: "Lachha Paratha", price: "89" },
      { name: "Cheesy Garlic Naan", price: "119" },
      { name: "Kulcha", price: "109 / 89", note: "Masala / Paneer" },
      { name: "Aloo Paratha", price: "95" },
    ],
  },
  {
    id: "chicken",
    group: "Indian",
    title: "Chicken",
    subtitle: "4 pcs unless mentioned",
    img: chicken,
    items: [
      { name: "Chicken Kosha", price: "279" },
      { name: "Chicken Duk-Bunglow", price: "319" },
      { name: "Kadhai Chicken", price: "299" },
      { name: "Chicken Do-Pyaza", price: "289" },
      { name: "Hyderabadi Chicken", price: "319" },
      { name: "Butter Chicken", price: "329" },
      { name: "Chicken Bharta", price: "279" },
      { name: "Handi Chicken", price: "319" },
      { name: "Chicken Tikka Butter Masala", price: "329", note: "6 pcs" },
      { name: "Chicken Reshmi Butter Masala", price: "349", note: "6 pcs" },
      { name: "Chicken Lababdar", price: "329", note: "6 pcs" },
      { name: "Riko's Balti Chicken", price: "349" },
      { name: "Riko's Chicken Patiala", price: "349" },
    ],
  },
  {
    id: "mutton",
    group: "Indian",
    title: "Mutton",
    subtitle: "4 pcs",
    img: mutton,
    items: [
      { name: "Mutton Kosha", price: "399" },
      { name: "Mutton Roganjosh", price: "395" },
      { name: "Handi Mutton", price: "409" },
      { name: "Kadhai Mutton", price: "399" },
      { name: "Mutton Rarha Masala", price: "349" },
      { name: "Hyderabadi Mutton", price: "409" },
      { name: "Mutton Keema Masala", price: "349" },
      { name: "Mutton Kolhapuri", price: "409" },
      { name: "Riko's Balti Mutton", price: "409" },
      { name: "Champaran Mutton", price: "519", note: "Signature" },
      { name: "Champaran Chicken", price: "410", note: "Signature" },
    ],
  },
  {
    id: "prawn",
    group: "Indian",
    title: "Prawn & Fish",
    subtitle: "Prawn 4 pcs · Fish 2 pcs (Katla / Basa)",
    img: prawn,
    items: [
      { name: "Prawn Masala", price: "409" },
      { name: "Prawn Do-Pyaza", price: "409" },
      { name: "Prawn Malaikari", price: "419" },
      { name: "Fish Curry", price: "230 / 315" },
      { name: "Fish Masala", price: "230 / 319" },
      { name: "Fish Tikka Butter Masala", price: "405 / 519" },
    ],
  },
  {
    id: "chinese-spec",
    group: "Chinese",
    title: "Chinese Specialities",
    img: chineseSpec,
    items: [
      { name: "Conjai Crispy", price: "279 / 329" },
      { name: "Lat Me Kai", price: "279", note: "Butter fry chicken, chilli oyster" },
      { name: "Pan Fried Fish", price: "329", note: "Shallow fried, chilli sauce" },
      { name: "Crispy Chilli Coriander", price: "279 / 329" },
      { name: "Pad Thai Kai", price: "289", note: "Thai spices & basil" },
      { name: "Gai Yong Kai", price: "279" },
      { name: "Gung Pad Thai", price: "359", note: "Prawns, Thai spices" },
    ],
  },
  {
    id: "chinese-start",
    group: "Chinese",
    title: "Chinese Starters",
    subtitle: "6 pcs · Chicken / Fish / Prawn",
    img: chineseStart,
    items: [
      { name: "Chilly Dry", price: "289 / 329 / 359" },
      { name: "Kung Pao", price: "299 / 339 / 369" },
      { name: "Dragon", price: "310 / 349 / 379" },
      { name: "Teriyaki Dry", price: "310 / 359 / 390" },
      { name: "Mongolian Dry", price: "299 / 339 / 369" },
      { name: "Crispy", price: "299 / 359" },
      { name: "Pepper", price: "299 / 339" },
      { name: "Chicken 65", price: "310" },
      { name: "Chicken Lollipop", price: "299" },
      { name: "Crunchy Chicken", price: "299" },
      { name: "Drums of Heaven", price: "349" },
    ],
  },
  {
    id: "gravy",
    group: "Gravy",
    title: "Chinese Gravy",
    subtitle: "Fish / Chicken / Prawn",
    img: chineseSpec,
    items: [
      { name: "Chilli", price: "345 / 310 / 359" },
      { name: "Schezwan", price: "355 / 325 / 369" },
      { name: "Hot Garlic Sauce", price: "345 / 310 / 355" },
      { name: "Sweet 'N' Sour", price: "335 / 299 / 355" },
      { name: "Manchurian", price: "335 / 299 / 359" },
      { name: "Hunan Sauce", price: "369 / 335 / 389" },
      { name: "Hong Kong", price: "359 / 325 / 379" },
      { name: "Thai Red Curry", price: "349 / 409", note: "Chicken / Prawn" },
      { name: "Japanese Grilled", price: "385 / 425", note: "Chicken / Fish, sticky rice" },
      { name: "Malaysian Curry", price: "325 / 409", note: "Chicken / Prawn" },
    ],
  },
  {
    id: "tandoor-chicken",
    group: "Tandoor",
    title: "Tandoor · Chicken",
    subtitle: "6 pcs",
    img: tandoor,
    items: [
      { name: "Tandoori Chicken", price: "289 / 469", note: "Half / Full" },
      { name: "Chicken Tikka Kebab", price: "289" },
      { name: "Reshmi Kebab", price: "329" },
      { name: "Gondhoraj Tikka", price: "299" },
      { name: "Jungli Kebab", price: "299" },
      { name: "Hariyali Kebab", price: "319" },
      { name: "Malai Kebab", price: "349" },
      { name: "Keshari Malai Kebab", price: "439" },
      { name: "Tangri Kebab", price: "239 / 409", note: "Half / Full" },
      { name: "Riko's Fire Kebab", price: "459", note: "Signature" },
      { name: "Sholay Kebab", price: "329" },
      { name: "Chicken Seekh Kebab", price: "329" },
      { name: "Mutton Seekh Kebab", price: "439" },
    ],
  },
  {
    id: "tandoor-seafood",
    group: "Tandoor",
    title: "Tandoor · Fish & Seafood",
    subtitle: "4 pcs · Basa / Vetki",
    img: fish,
    items: [
      { name: "Fish Tikka", price: "369 / 469" },
      { name: "Fish Achari Kebab", price: "399 / 479" },
      { name: "Ajwaini Fish Tikka", price: "379 / 479" },
      { name: "Gondhoraj Fish", price: "389 / 499" },
      { name: "Tandoori Prawn", price: "449", note: "6 pcs" },
      { name: "Tandoor Pomfret", price: "399", note: "1 pc" },
    ],
  },
  {
    id: "veg",
    group: "Tandoor",
    title: "Vegetarian & Platters",
    img: veg,
    items: [
      { name: "Paneer Hyderabadi", price: "299", note: "6 pcs" },
      { name: "Paneer Tikka Kebab", price: "289", note: "6 pcs" },
      { name: "Paneer Achari Tikka", price: "299", note: "6 pcs" },
      { name: "Stuffed Mushroom", price: "279" },
      { name: "Mushroom Tikka Kebab", price: "269", note: "6 pcs" },
      { name: "Stuffed Aloo", price: "299", note: "6 pcs" },
      { name: "Chili Paneer Dry", price: "309" },
      { name: "Honey Chily Potato", price: "289" },
      { name: "Crispy Veggies", price: "229" },
      { name: "Veg Manchurian Dry", price: "219" },
      { name: "Riko's Veg Platter", price: "389", note: "8 pcs" },
      { name: "Riko's Non-Veg Platter", price: "449", note: "8 pcs" },
    ],
  },
  {
    id: "drinks",
    group: "Drinks",
    title: "Drinks",
    img: drinks,
    items: [
      { name: "Masala Cold Drink", price: "90" },
      { name: "Fresh Lime Soda", price: "80" },
      { name: "Watermelon Lime Soda", price: "149" },
      { name: "Cranberry Lime Soda", price: "169" },
      { name: "Barddhaman Blueberry", price: "205" },
      { name: "Juice (as per availability)", price: "80" },
      { name: "Mineral Water", price: "28" },
    ],
  },
  {
    id: "mocktails",
    group: "Drinks",
    title: "Mocktails",
    img: mocktail,
    items: [
      { name: "Mojito", price: "195 / 209 / 219", note: "Virgin / Watermelon / Cranberry" },
      { name: "Deep Blue Sea", price: "205" },
      { name: "Blushing Bride", price: "219" },
      { name: "Watermelon Punch", price: "195" },
      { name: "Honeymoon", price: "205" },
      { name: "Virgin Colada", price: "240" },
      { name: "Rock On The Beach", price: "249" },
      { name: "Pink Lady", price: "205" },
      { name: "Strawberry Punch", price: "195" },
      { name: "Mango Blossom", price: "239" },
      { name: "Pineapple Blossom", price: "239" },
      { name: "Bee's Kiss", price: "239" },
      { name: "Sun Rise", price: "195" },
    ],
  },
];

const filters = ["All", "Indian", "Chinese", "Gravy", "Tandoor", "Drinks"] as const;
type Filter = (typeof filters)[number];

export function Menu() {
  const { menuData } = Route.useLoaderData();
  const dbSections = menuData?.categories?.length ? menuData.categories.map((c: any) => ({
    id: c.slug,
    group: c.name,
    title: c.name,
    subtitle: c.description,
    img: c.imageUrl || rice, // fallback
    items: c.items.map((i: any) => ({
      name: i.name,
      price: i.price.toString(),
      note: i.description
    }))
  })) : sections;

  const [active, setActive] = useState<Filter>("All");
  const visible = active === "All" ? dbSections : dbSections.filter((s: any) => s.group === active);

  return (
    <section id="menu" className="relative py-32 scroll-mt-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px hairline" />
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <Reveal>
              <SectionEyebrow>The Menu</SectionEyebrow>
              <h2 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
                From our kitchen to your{" "}
                <span className="gold-gradient-text italic">table</span>.
              </h2>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                A curated journey across Indian classics, wok-fired Chinese, live
                tandoor and a lounge bar of signature mocktails. All prices in ₹.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap gap-2">
          {filters.map((c) => (
            <button
              key={c}
              onClick={() => setActive(c)}
              className={`rounded-full border px-5 py-2 text-[11px] uppercase tracking-[0.28em] transition-all ${
                active === c
                  ? "border-gold bg-gold text-primary-foreground"
                  : "border-white/10 bg-white/[0.02] text-muted-foreground hover:border-gold/40 hover:text-gold"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <motion.div layout className="mt-16 flex flex-col gap-20">
          <AnimatePresence mode="popLayout">
            {visible.map((s: any, idx: number) => (
              <motion.article
                key={s.id}
                layout
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className={`grid gap-10 lg:grid-cols-12 lg:items-center ${
                  idx % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                }`}
              >
                {/* Image */}
                <div className="lg:col-span-5">
                  <div className="group relative overflow-hidden rounded-3xl glass-card">
                    <div className="relative h-80 sm:h-96 overflow-hidden">
                      <img
                        src={s.img}
                        alt={s.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card via-card/20 to-transparent" />
                      <div className="absolute left-5 top-5 rounded-full border border-gold/40 bg-background/50 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-gold backdrop-blur-md">
                        {s.group}
                      </div>
                    </div>
                  </div>
                </div>

                {/* List */}
                <div className="lg:col-span-7">
                  <div className="flex items-baseline gap-4">
                    <h3 className="font-display text-4xl sm:text-5xl">
                      {s.title}
                    </h3>
                    <div className="hidden h-px flex-1 bg-gold/20 sm:block" />
                  </div>
                  {s.subtitle && (
                    <p className="mt-2 text-xs uppercase tracking-[0.28em] text-gold/80">
                      {s.subtitle}
                    </p>
                  )}

                  <ul className="mt-8 flex flex-col divide-y divide-white/5">
                    {s.items.map((it: any) => (
                      <li
                        key={it.name}
                        className="flex items-baseline gap-4 py-3 transition-colors hover:text-gold"
                      >
                        <div className="flex-1">
                          <div className="font-display text-lg leading-tight">
                            {it.name}
                          </div>
                          {it.note && (
                            <div className="mt-0.5 text-xs italic text-muted-foreground">
                              {it.note}
                            </div>
                          )}
                        </div>
                        <div
                          className="mx-3 h-px flex-1 self-center opacity-40"
                          style={{
                            backgroundImage:
                              "radial-gradient(circle, rgba(201,162,39,0.6) 1px, transparent 1.5px)",
                            backgroundSize: "8px 2px",
                            backgroundRepeat: "repeat-x",
                          }}
                        />
                        <div className="font-display text-lg tabular-nums text-gold">
                          ₹ {it.price}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        <p className="mt-20 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Taxes extra as applicable · Menu subject to seasonal change
        </p>
      </div>
    </section>
  );
}