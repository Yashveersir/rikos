const quick = ["Home", "About", "Menu", "Gallery", "Reviews", "Contact"];
const menuLinks = ["Indian", "Chinese", "Tandoor", "Rice", "Starters", "Mocktails"];
import { NewsletterForm } from "./NewsletterForm";

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-[color:var(--ink)] py-16">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-3xl tracking-wide gold-gradient-text">
            RIKO&apos;S
          </div>
          <p className="mt-1 text-[10px] uppercase tracking-[0.4em] text-muted-foreground">
            Cafe · Restro-Lounge
          </p>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-muted-foreground">
            A premium restro-lounge on the 5th floor of Regent Star Mall,
            Burdwan — where every visit feels like a celebration.
          </p>
          <NewsletterForm />
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Quick Links</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {quick.map((q) => (
              <li key={q}>
                <a href={`#${q.toLowerCase()}`} className="hover:text-gold">
                  {q}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-gold">Menu</p>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            {menuLinks.map((m) => (
              <li key={m}>
                <a href="#menu" className="hover:text-gold">
                  {m}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-14 max-w-7xl border-t border-white/5 px-6 pt-6">
        <div className="flex flex-col items-center justify-between gap-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Riko&apos;s Cafe & Restro-Lounge</p>
          <p>Burdwan · West Bengal</p>
        </div>
      </div>
    </footer>
  );
}