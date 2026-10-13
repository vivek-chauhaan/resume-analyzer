import Hero from "./sections/Hero";
import Highlights from "./sections/Highlights";
import Features from "./sections/Features";
import HowItWorks from "./sections/HowItWorks";
import Faq from "./sections/Faq";
import CtaSection from "./sections/CtaSection";
import Contact from "./sections/Contact";

export default function Landing() {
  return (
    <>
      <Hero />
      <Highlights />
      <Features />
      <HowItWorks />
      <Faq />
      <CtaSection />
      <Contact />
    </>
  );
}
