import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'Rakshak Enclave',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function CatalogPage() {
  redirect('/');
}
