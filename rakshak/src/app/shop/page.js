import ApparelStore from '@/components/ApparelStore';

export const metadata = {
  title: 'Rakshak Apparels® | Independent Streetwear & Footwear Shop',
  description: 'Official direct-to-consumer online shop for Rakshak Apparels. Discover 280 GSM organic cotton tees, 450 GSM French terry hoodies, and Vibram sneakers.',
  keywords: [
    'Rakshak shop',
    'Rakshak Apparels',
    'buy streetwear online',
    'heavyweight hoodies',
    'Vibram sneakers',
    'organic cotton tees',
  ],
  publisher: 'Rakshak Apparel & Footwear Co.',
  openGraph: {
    title: 'Rakshak Apparels® | Streetwear & Footwear Drops',
    description: 'Shop heavyweight organic cotton tees, loopback French terry hoodies, and Vibram runner sneakers directly from Rakshak Studio.',
    url: 'https://rakshakus.vercel.app/shop',
    siteName: 'Rakshak Apparels',
    type: 'website',
  },
};

export default function ShopPage() {
  return <ApparelStore />;
}
