import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add New Prompt',
  description: 'Add a new prompt to the gallery',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function AddLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    </>
  );
}
