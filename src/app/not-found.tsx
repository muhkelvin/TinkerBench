import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 text-center">
      <div className="font-mono text-xs uppercase tracking-wider text-[var(--bench-secondary)] mb-2">
        404 — Not Found
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-[var(--bench-primary)] mb-3">
        Halaman tidak ditemukan
      </h1>
      <p className="text-[var(--bench-secondary)] max-w-md mb-6 leading-relaxed">
        Halaman atau konten yang Anda cari mungkin telah dipindahkan, diarsipkan, atau tautan yang dimasukkan salah.
      </p>
      <Link
        href="/"
        className="touch-target px-5 py-2.5 rounded-lg bg-[var(--bench-primary)] text-[var(--bench-surface)] font-medium text-sm inline-flex items-center gap-2 hover:opacity-90 transition-opacity"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Beranda
      </Link>
    </div>
  );
}
