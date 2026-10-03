import Navbar from '@/components/Navbar';
import StatusPageClient from '@/components/StatusPageClient';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Network & System Status - Rakshak',
  description: 'Real-time operational status, global edge latency benchmarks, and 90-day verified uptime metrics for Rakshak services.',
};

export default function StatusPage() {
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
