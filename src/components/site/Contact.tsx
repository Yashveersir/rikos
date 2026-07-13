import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from "lucide-react";
import { Reveal, SectionEyebrow } from "./Reveal";
import { ContactForm } from "./ContactForm";

export function Contact() {
  return (
    <section id="contact" className="relative py-32 scroll-mt-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <Reveal>
            <SectionEyebrow>Visit Us</SectionEyebrow>
            <h2 className="font-display text-5xl leading-[1.05] tracking-tight sm:text-6xl">
              Come see it for <span className="gold-gradient-text italic">yourself</span>.
            </h2>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <div className="relative h-full overflow-hidden rounded-3xl border border-white/10">
              <iframe
                title="Riko's location"
                src="https://www.google.com/maps?q=Regent+Star+Mall+Golapbag+More+Burdwan&output=embed"
                className="h-full min-h-[420px] w-full grayscale-[40%] contrast-110"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/10" />
            </div>
          </Reveal>

          <Reveal delay={1}>
            <div className="grid gap-4">
              <InfoRow icon={MapPin} label="Address">
                5th Floor, Regent Star Mall,
                <br />
                Golapbag More, Grand Trunk Road,
                <br />
                Burdwan, West Bengal
              </InfoRow>
              <InfoRow icon={Phone} label="Phone">
                <a href="tel:+910000000000" className="hover:text-gold">
                  +91 00000 00000
                </a>
              </InfoRow>
              <InfoRow icon={Mail} label="Email">
                <a href="mailto:hello@rikoscafe.in" className="hover:text-gold">
                  hello@rikoscafe.in
                </a>
              </InfoRow>
              <InfoRow icon={Clock} label="Opening Hours">
                Mon – Sun · 12:00 PM – 11:30 PM
              </InfoRow>

              <div className="flex gap-3 pt-2 pb-4">
                <SocialButton icon={Instagram} label="Instagram" href="#" />
                <SocialButton icon={Facebook} label="Facebook" href="#" />
              </div>
              
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-5 rounded-2xl glass-card p-6">
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-gold/30 bg-gold/10 text-gold">
        <Icon size={18} strokeWidth={1.5} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{label}</p>
        <div className="mt-1.5 text-base leading-relaxed text-foreground/90">{children}</div>
      </div>
    </div>
  );
}

function SocialButton({
  icon: Icon,
  label,
  href,
}: {
  icon: typeof Instagram;
  label: string;
  href: string;
}) {
  return (
    <a
      href={href}
      aria-label={label}
      className="grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white/[0.02] text-muted-foreground transition-all hover:border-gold/60 hover:text-gold"
    >
      <Icon size={18} strokeWidth={1.5} />
    </a>
  );
}