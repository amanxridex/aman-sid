import Navbar from '@/components/Navbar';
import StatusPageClient from '@/components/StatusPageClient';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Real-Time Uptime & SLA - Rakshak',
  description: 'Verified 99.99% global uptime SLA, real-time edge latency benchmarks, and operational service metrics.',
};

export default function UptimePage() {
  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: '3.5rem' }}>
        <StatusPageClient />
      </div>
      <Footer />
    </main>
  );
}
