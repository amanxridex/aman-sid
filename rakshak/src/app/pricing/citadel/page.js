import Navbar from '@/components/Navbar';
import PlanDetailView from '@/components/PlanDetailView';
import Footer from '@/components/Footer';
import { pricingPlans } from '@/data/pricingPlans';

export const metadata = {
  title: 'Rakshak Citadel ($149/yr) - 50+ Sovereign Kernel Fortification & Enterprise Features',
  description: 'Explore all 50+ features included in Rakshak Citadel: Unlimited device licenses, enterprise model poisoning grid, 24/7 VIP engineer direct line, and fleet deployment.',
};

export default function CitadelPlanPage() {
  const plan = pricingPlans.citadel;
  const otherPlans = [pricingPlans.sentinel, pricingPlans.aegis];

  return (
    <main>
      <Navbar />
      <PlanDetailView plan={plan} otherPlans={otherPlans} />
      <Footer />
    </main>
  );
}
