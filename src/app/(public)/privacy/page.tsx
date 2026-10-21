import React from 'react';
import type { Metadata } from 'next';
import { ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — Kebijakan Privasi',
  description: 'Kebijakan privasi dan transparansi data pengunjung Tinkerbench Labs.',
};

export default function PrivacyPage() {
  return (
    <div className="max-w-[740px] mx-auto space-y-8">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-1.5 font-mono text-xs text-[#686960] uppercase">
          <ShieldCheck className="w-4 h-4 text-[#24251F]" />
          <span>Privasi & Data</span>
        </div>
        <h1 className="h1-fluid text-[#24251F]">
          Kebijakan Privasi
        </h1>
        <p className="text-[#686960] leading-relaxed">
          Tinkerbench Labs menghormati hak privasi setiap pengunjung. Komitmen kami sederhana dan transparan.
        </p>
      </header>

      <div className="space-y-6 text-[#24251F] leading-relaxed">
        <section className="space-y-2 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-6">
          <h2 className="text-base font-semibold text-[#24251F]">
            1. Tidak Ada Pelacakan Pribadi (No Tracking)
          </h2>
          <p className="text-sm text-[#686960]">
            Situs ini tidak memasang cookie pelacak lintas situs (third-party tracking cookies), pixel iklan, atau script sidik jari perangkat (fingerprinting).
          </p>
        </section>

        <section className="space-y-2 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-6">
          <h2 className="text-base font-semibold text-[#24251F]">
            2. Tidak Ada Akun Pengunjung atau Penyimpanan Pesan
          </h2>
          <p className="text-sm text-[#686960]">
            Kami tidak mewajibkan pendaftaran akun untuk membaca artikel atau melihat demo proyek. Tautan komunikasi langsung seperti WhatsApp atau email hanya menghubungkan Anda ke aplikasi resmi masing-masing tanpa menyimpan riwayat pesan ke dalam basis data situs ini.
          </p>
        </section>

        <section className="space-y-2 rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-6">
          <h2 className="text-base font-semibold text-[#24251F]">
            3. Hosting & Log Server
          </h2>
          <p className="text-sm text-[#686960]">
            Website di-host menggunakan platform Vercel dan Supabase. Log server standar (alamat IP dan user agent) diproses oleh penyedia hosting hanya untuk tujuan stabilitas jaringan, pencegahan serangan DDoS, dan pemeliharaan performa.
          </p>
        </section>
      </div>
    </div>
  );
}
