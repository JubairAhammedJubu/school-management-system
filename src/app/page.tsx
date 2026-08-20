import Banner from "@/components/Banner/Banner";
import MarqueeSection from "@/components/Marquee/MarqueeSection";
import HowItWorks from "@/components/HowItWorks/HowItWorks";
import RoleBasedAccess from "@/components/RoleBasedAccess/RoleBasedAccess";
import ProductVision from "@/components/ProductVisionQuote/ProductVisionQuote";
import FAQSection from "@/components/FAQ/FAQ";
import Footer from "@/components/Footer/Footer";

const Page = () => {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans transition-colors duration-300">
      <Banner />
      <MarqueeSection />
      <HowItWorks />
      <RoleBasedAccess />
      <ProductVision />
      <FAQSection />
      <Footer />
    </main>
  );
};

export default Page;
