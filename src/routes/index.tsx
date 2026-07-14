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
import { publicGetSettings } from "@/api/settings";
import { publicGetReviews } from "@/api/testimonial";

export const Route = createFileRoute("/")({
  component: Index,
  loader: async () => {
    try {
      const [menuData, galleryData, settingsData, reviewsData] = await Promise.all([
        publicGetMenu().catch(() => null),
        publicGetGallery().catch(() => null),
        publicGetSettings().catch(() => null),
        publicGetReviews().catch(() => null)
      ]);
      return { menuData, galleryData, settingsData, reviewsData };
    } catch (e) {
      console.error("Failed to load initial data:", e);
      return { menuData: null, galleryData: null, settingsData: null, reviewsData: null };
    }
  },
});

function Index() {
  const { settingsData, reviewsData } = Route.useLoaderData();
  const settings = settingsData || {};

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <Navbar settings={settings} />
      <main>
        <Hero settings={settings} />
        <About settings={settings} />
        <Features settings={settings} />
        <Signature settings={settings} />
        <Menu />
        <Gallery />
        <Reviews reviewsData={reviewsData} />
        <CTA />
        <Contact settings={settings} />
      </main>
      <Footer settings={settings} />
      <ReservationDialog />
    </div>
  );
}
