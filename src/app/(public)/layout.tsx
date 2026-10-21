import React, { Suspense } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div className="h-14 bg-[#F5F3EC] border-b border-[#E5E1D6]" />}>
        <Header />
      </Suspense>
      <main className="flex-1 w-full max-w-[1120px] mx-auto px-4 sm:px-6 py-8 md:py-12">
        {children}
      </main>
      <Footer />
    </>
  );
}
