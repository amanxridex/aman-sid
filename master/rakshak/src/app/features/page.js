import Navbar from '@/components/Navbar';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Features - Rakshak Anti-AI Shield',
  description: 'Explore the Zero-Trust File Vault, Kernel I/O Scraper Trap, and Adversarial Honeypot Generator.',
};

export default function FeaturesPage() {
  return (
    <main>

      <Navbar />
      <div style={{ paddingTop: '3.5rem' }}>
        <Features />
      </div>
      <Footer />
    </main>
  );
}

