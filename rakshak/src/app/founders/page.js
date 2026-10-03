import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Founders from '@/components/Founders';

export const metadata = {
  title: 'Founders - Rakshak Anti-AI Shield',
  description:
    'Learn about the three anonymous systems architects behind Rakshak and why our team operates under complete cryptographic sovereignty.',
  keywords: [
    'Rakshak Founders',
    'Anonymous Founders',
    'Unknown 1',
    'Unknown 2',
    'Unknown 3',
    'Zero-Knowledge Identity',
    'Anti-AI Shield Team',
    'Kernel Driver Architects',
  ],
};

export default function FoundersPage() {
  return (
    <main>
      <Navbar />
      <div style={{ paddingTop: '3.5rem' }}>
        <Founders />
      </div>
      <Footer />
    </main>
  );
}
