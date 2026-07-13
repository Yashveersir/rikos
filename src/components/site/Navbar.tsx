import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import logoAsset from "@/assets/rikos-logo.webp.asset.json";
import { useQuery } from "@tanstack/react-query";
import { publicGetSettings } from "@/api/settings";

const links = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#menu", label: "Menu" },
  { href: "#gallery", label: "Gallery" },
  { href: "#reviews", label: "Reviews" },
  { href: "#contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const { data: settings } = useQuery({
    queryKey: ["publicSettings"],
    queryFn: () => publicGetSettings(),
  });

  const logoUrl = settings?.restaurant_logo || logoAsset.url;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl bg-background/70 border-b border-white/5 py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6">
        <a href="#home" className="group flex items-center">
          <span className="relative w-32 sm:w-40 overflow-hidden transition-all">
            <img
              src={logoUrl}
              alt="Riko's Cafe & Restro-Lounge"
              className="h-auto w-full object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-105"
            />
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="group relative text-sm uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-gold transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        <a
          href="#reserve"
          className="hidden rounded-full border border-gold/60 bg-gold/10 px-5 py-2 text-xs uppercase tracking-[0.2em] text-gold transition-all hover:bg-gold hover:text-primary-foreground hover:gold-glow md:inline-block"
        >
          Reserve Table
        </a>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-full border border-white/10 p-2 text-foreground md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="md:hidden"
        >
          <nav className="mx-6 mt-4 flex flex-col gap-1 rounded-2xl border border-white/10 bg-background/90 p-4 backdrop-blur-xl">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm uppercase tracking-[0.2em] text-muted-foreground hover:bg-white/5 hover:text-gold"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#reserve"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-gold px-4 py-3 text-center text-xs uppercase tracking-[0.25em] text-primary-foreground"
            >
              Reserve Table
            </a>
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
}