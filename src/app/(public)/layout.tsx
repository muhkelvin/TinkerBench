import React from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main className="flex-1 w-full max-w-[1120px] mx-auto px-4 sm:px-6 py-8 md:py-12">
        {children}
      </main>
      <Footer />
    </>
  );
}
