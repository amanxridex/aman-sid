import ShieldView from '@/components/ShieldView';

export const metadata = {
  title: 'Rakshak - Zero-Trust Local AI Protection Shield (Internal Telemetry)',
  description: 'Internal security portal for process isolation and disk call monitoring.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ShieldPage() {
  return <ShieldView />;
}
