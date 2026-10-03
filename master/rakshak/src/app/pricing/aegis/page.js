import Navbar from '@/components/Navbar';
import PlanDetailView from '@/components/PlanDetailView';
import Footer from '@/components/Footer';
import { pricingPlans } from '@/data/pricingPlans';

export const metadata = {
  title: 'Rakshak Aegis ($99/6mo) - 50+ Adversarial Honeypot & Pro Anti-AI Features',
  description: 'Explore all 50+ features included in Rakshak Aegis: Adversarial tensor noise generator, model poisoning, 3-device licenses, and multi-monitor Recall blocker.',
};

export default function AegisPlanPage() {
  const plan = pricingPlans.aegis;
  const otherPlans = [pricingPlans.sentinel, pricingPlans.citadel];

  return (
    <main>
      <Navbar />
      <PlanDetailView plan={plan} otherPlans={otherPlans} />
      <Footer />
    </main>
  );
}
