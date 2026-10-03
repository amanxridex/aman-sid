import Navbar from '@/components/Navbar';
import LivePerimeterRadar from '@/components/LivePerimeterRadar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Live Defense Observatory & Perimeter Radar - Rakshak',
  description: 'Real-time ingress traffic telemetry, deterministic invariant evaluation, and autonomous AI scraper deflection happening live across rakshakus.vercel.app.',
};

export default function SimulatorPage() {
  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: '3.5rem' }}>
        <LivePerimeterRadar />
      </div>
      <Footer />
    </main>
  );
}
