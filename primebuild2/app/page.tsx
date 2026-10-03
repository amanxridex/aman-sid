import Hero from "@/components/Hero";
import AccreditationsBar from "@/components/AccreditationsBar";
import SelectedWorks from "@/components/SelectedWorks";
import ServicesEditorial from "@/components/ServicesEditorial";
import RedNoiseBanner from "@/components/RedNoiseBanner";
import FAQ from "@/components/FAQ";
import BottomCTA from "@/components/BottomCTA";

export default function Home() {
  return (
    <main style={{ backgroundColor: '#ffffff', minHeight: '100vh', width: '100%' }}>
      <Hero />
      <AccreditationsBar />
      <SelectedWorks />
      <ServicesEditorial />
      <RedNoiseBanner />
      <FAQ />
      <BottomCTA />
    </main>
  );
}
