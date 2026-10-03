import Navbar from '@/components/Navbar';
import PlanDetailView from '@/components/PlanDetailView';
import Footer from '@/components/Footer';
import { pricingPlans } from '@/data/pricingPlans';

export const metadata = {
  title: 'Rakshak Sentinel ($19/mo) - 50+ Kernel Anti-AI Features & Specs',
  description: 'Explore all 50+ features included in Rakshak Sentinel: Ring 0 filesystem minifilter, Windows Recall blocker, directory locks, and zero-cloud airgapped defense.',
};

export default function SentinelPlanPage() {
  const plan = pricingPlans.sentinel;
  const otherPlans = [pricingPlans.aegis, pricingPlans.citadel];

  return (
    <main>
      <Navbar />
      <PlanDetailView plan={plan} otherPlans={otherPlans} />
      <Footer />
    </main>
  );
}
