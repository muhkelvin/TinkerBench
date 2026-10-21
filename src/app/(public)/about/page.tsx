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

export default function AboutPage() {
  return (
    <div className="max-w-[740px] mx-auto space-y-12">
      {/* Intro */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-[#24251F] bg-[#C7E36A] px-2.5 py-1 rounded border border-[#24251F]/20">
          <Terminal className="w-3.5 h-3.5" />
          <span>INDEPENDENT SOFTWARE LAB</span>
        </div>
        <h1 className="h1-fluid text-[#24251F]">
          Tentang Tinkerbench Labs
        </h1>
        <p className="text-lg text-[#686960] leading-relaxed">
          Tinkerbench adalah lab software independen untuk membangun, menguji, dan mendokumentasikan produk digital pribadi.
        </p>
      </section>

      {/* Origin & Motivation */}
      <section className="space-y-4 leading-relaxed text-[#24251F]">
        <h2 className="text-xl font-semibold tracking-tight text-[#24251F]">
          A place for things in progress
        </h2>
        <p>
          Banyak ide aplikasi berhenti di tahap angan-angan atau terkubur di direktori lokal komputer tanpa pernah melihat dunia nyata. Tinkerbench dibuat sebagai meja kerja terbuka (<i>workshop bench</i>): tempat di mana ide ditransformasikan menjadi aplikasi konkret yang bisa diuji langsung oleh pengguna.
        </p>
        <p>
          Meskipun berstatus lab independen, <strong>saya sangat terbuka untuk kerja sama profesional dan proyek klien</strong>. Jika Anda melihat prototipe, arsitektur, atau sistem di sini yang relevan dengan kebutuhan bisnis Anda — baik untuk <strong>pembuatan website baru, custom web application, PWA, maupun pengembangan SaaS</strong> — kita bisa mendiskusikannya dan mewujudkannya bersama.
        </p>
        <p className="text-[#686960] text-sm">
          Tanpa birokrasi agensi yang berbelit-belit atau klaim berlebihan: Anda berdiskusi dan bekerja langsung dengan developer yang merancang logika dan membangun kode dari baris pertama.
        </p>
      </section>

      {/* Work Principles */}
      <section className="space-y-5 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-[#24251F]">
          Tiga Prinsip Kerja
        </h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#24251F] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm text-[#24251F]">1. Membangun Proyek Nyata & Fungsional</h3>
              <p className="text-sm text-[#686960] mt-0.5">
                Mengutamakan sistem kerja yang menyelesaikan masalah nyata dengan performa tinggi, bukan sekadar mock-up visual tanpa logika database.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#24251F] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm text-[#24251F]">2. Menguji di Kondisi Nyata</h3>
              <p className="text-sm text-[#686960] mt-0.5">
                Mengoptimalkan aplikasi untuk kondisi sebenarnya: responsive di layar HP kecil (320px), load time instan, dan skenario offline-first.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#24251F] shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-sm text-[#24251F]">3. Komunikasi Transparan & Langsung</h3>
              <p className="text-sm text-[#686960] mt-0.5">
                Mencatat keputusan arsitektur, trade-off teknis, dan estimasi waktu pengerjaan secara jujur dan transparan kepada klien dan mitra.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services & Commercial Offering */}
      <section className="space-y-4 rounded-xl border border-[#C7E36A]/60 bg-[#C7E36A]/10 p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-[#24251F]">
          Layanan & Kerja Sama yang Tersedia
        </h2>
        <p className="text-sm text-[#24251F] leading-relaxed">
          Punya ide produk digital, butuh sistem kasir/operasional khusus, atau ingin membangun website performa tinggi untuk bisnis Anda? Beberapa hal yang siap saya kerjakan:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-xs text-[#24251F] pt-1">
          <li className="flex items-center gap-2 bg-[#FFFEFA] p-2.5 rounded-lg border border-[#E5E1D6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24251F]" />
            <span>Custom Web Application & Dashboard</span>
          </li>
          <li className="flex items-center gap-2 bg-[#FFFEFA] p-2.5 rounded-lg border border-[#E5E1D6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24251F]" />
            <span>PWA & Offline-First POS System</span>
          </li>
          <li className="flex items-center gap-2 bg-[#FFFEFA] p-2.5 rounded-lg border border-[#E5E1D6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24251F]" />
            <span>High-Performance Showcase & Portfolio</span>
          </li>
          <li className="flex items-center gap-2 bg-[#FFFEFA] p-2.5 rounded-lg border border-[#E5E1D6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24251F]" />
            <span>Fullstack MVP & SaaS Prototype</span>
          </li>
          <li className="flex items-center gap-2 bg-[#FFFEFA] p-2.5 rounded-lg border border-[#E5E1D6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24251F]" />
            <span>Landing Page</span>
          </li>
          <li className="flex items-center gap-2 bg-[#FFFEFA] p-2.5 rounded-lg border border-[#E5E1D6]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#24251F]" />
            <span>Company Profile</span>
          </li>
        </ul>
      </section>

      {/* Author & Contact */}
      <section className="space-y-4 pt-4 border-t border-[#E5E1D6]">
        <h2 className="text-xl font-semibold tracking-tight text-[#24251F]">
          Mari Terhubung & Mulai Proyek Anda
        </h2>
        <p className="text-[#686960] leading-relaxed">
          Jika Anda tertarik membangun sesuatu bersama, ingin membeli/menyesuaikan sistem dari Labs, atau sekadar ingin berkonsultasi mengenai teknis arsitektur:
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          {siteConfig.links.whatsapp && (
            <a
              href={`${siteConfig.links.whatsapp}?text=Halo,%20saya%20tertarik%20untuk%20diskusi%20proyek%20dengan%20Tinkerbench`}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target px-5 py-2.5 rounded-lg bg-[#24251F] text-[#FFFEFA] text-sm font-medium inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <MessageCircle className="w-4 h-4 text-[#C7E36A] fill-[#24251F]" />
              <span>Chat WhatsApp (Diskusi Proyek)</span>
            </a>
          )}
          {siteConfig.links.email && (
            <a
              href={`mailto:${siteConfig.links.email}?subject=Diskusi%20Proyek%20Baru`}
              className="touch-target px-4 py-2.5 rounded-lg border border-[#E5E1D6] bg-[#FFFEFA] text-[#24251F] text-sm font-medium inline-flex items-center gap-2 hover:bg-[#F5F3EC] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#24251F]" />
              <span>Kirim Email</span>
            </a>
          )}
          {siteConfig.links.github && (
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="touch-target px-4 py-2.5 rounded-lg border border-[#E5E1D6] bg-[#FFFEFA] text-[#24251F] text-sm font-medium inline-flex items-center gap-2 hover:bg-[#F5F3EC] transition-colors"
            >
              <GithubIcon className="w-4 h-4" />
              <span>GitHub</span>
            </a>
          )}
        </div>
      </section>
    </div>
  );
}
