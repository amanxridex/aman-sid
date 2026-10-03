import Navbar from '@/components/Navbar';
import FAQPageClient from '@/components/FAQPageClient';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'FAQ - Rakshak Zero-Trust Kernel Anti-AI Shield',
  description: 'Frequently asked questions regarding Rakshak Ring 0 minifilter driver, honeypot model poisoning, system performance, and zero-cloud architecture.',
};

export default function FAQPage() {
  return (
    <main>

      <Navbar />
      <FAQPageClient />
      <Footer />
    </main>
  );
}

