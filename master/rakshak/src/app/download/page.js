import Navbar from '@/components/Navbar';
import DownloadPageClient from '@/components/DownloadPageClient';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Download Rakshak - Kernel Anti-AI Shield for Windows, macOS & Linux',
  description: 'Download signed installer binaries, winget packages, brew casks, and curl scripts for Rakshak zero-trust local AI protection shield.',
};

export default function DownloadPage() {
  return (
    <main>

      <Navbar />
      <DownloadPageClient />
      <Footer />
    </main>
  );
}

