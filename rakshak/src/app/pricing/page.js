import Navbar from '@/components/Navbar';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Pricing - Rakshak Anti-AI Shield',
  description: 'Flexible protection plans: $19/month, $99 for 6 months, and $149/year.',
};

export default function PricingPage() {
  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: '3.5rem' }}>
        <Pricing />
      </div>
      <Footer />
    </main>
  );
}
