import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { About } from "@/components/site/About";
import { Features } from "@/components/site/Features";
import { Signature } from "@/components/site/Signature";
import { Menu } from "@/components/site/Menu";
import { Gallery } from "@/components/site/Gallery";
import { Reviews } from "@/components/site/Reviews";
import { CTA } from "@/components/site/CTA";
import { Contact } from "@/components/site/Contact";
import { Footer } from "@/components/site/Footer";
import { ReservationDialog } from "@/components/site/ReservationDialog";

import { publicGetMenu } from "@/api/menu";
import { publicGetGallery } from "@/api/gallery";

export const Route = createFileRoute("/")({
  component: Index,
  loader: async () => {
    try {
      const [menuData, galleryData] = await Promise.all([
        publicGetMenu().catch(() => null),
        publicGetGallery().catch(() => null)
      ]);
      return { menuData, galleryData };
    } catch (e) {
      console.error("Failed to load initial data:", e);
      return { menuData: null, galleryData: null };
    }
  },
});

function Index() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Features />
        <Signature />
        <Menu />
        <Gallery />
        <Reviews />
        <CTA />
        <Contact />
      </main>
      <Footer />
      <ReservationDialog />
    </div>
  );
}
