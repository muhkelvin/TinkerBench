import React from 'react';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';
import { Mail, MessageCircle, Terminal, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'About — Tentang Tinkerbench Labs',
  description:
    'Mengenal ruang kerja independen, prinsip editorial workshop, dan pendekatan teknis di balik Tinkerbench Labs.',
};

import { AboutContent } from '@/components/about/AboutContent';

export default function AboutPage() {
  return <AboutContent />;
}
