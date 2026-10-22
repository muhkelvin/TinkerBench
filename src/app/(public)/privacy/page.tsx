import React from 'react';
import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — Kebijakan Privasi',
  description: 'Kebijakan privasi dan transparansi data pengunjung Tinkerbench Labs.',
};

import { PrivacyContent } from '@/components/privacy/PrivacyContent';

export default function PrivacyPage() {
  return <PrivacyContent />;
}
