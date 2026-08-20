import Banner from "@/components/Banner/Banner";
import MarqueeSection from "@/components/Marquee/MarqueeSection";
import ProductVision from "@/components/ProductVisionQuote/ProductVisionQuote";
import TalkToUs from "@/components/TalkToUs/TalkToUs";
import Footer from "@/components/Footer/Footer";

const Page = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <Banner />
      <MarqueeSection />
      <ProductVision />
      <TalkToUs />
      <Footer />
    </main>
  );
};

export default Page;
