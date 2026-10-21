'use client';

import React, { useActionState } from 'react';
import { loginAdmin } from '@/actions/auth';
import { Lock, ArrowRight } from 'lucide-react';

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAdmin, null);

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-xl border border-[#E5E1D6] bg-[#FFFEFA] p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 mb-2 font-mono text-xs uppercase tracking-wider text-[#686960]">
          <Lock className="w-3.5 h-3.5 text-[#24251F]" />
          <span>Tinkerbench Admin</span>
        </div>

        <h1 className="text-xl font-semibold tracking-tight text-[#24251F] mb-2">
          Masuk Administrator
        </h1>
        <p className="text-xs text-[#686960] mb-6 leading-relaxed">
          Satu akun admin untuk mengelola seluruh proyek, catatan, dan media tanpa edit kode.
        </p>

        {state?.error && (
          <div className="mb-4 p-3 rounded-lg bg-[#B42318]/10 border border-[#B42318]/30 text-xs text-[#B42318]">
            {state.error}
          </div>
        )}

        <form action={formAction} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block font-mono text-xs text-[#24251F] mb-1.5"
            >
              Email Admin
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="admin@tinkerbench.dev"
              className="w-full h-11 px-3 text-[16px] rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] placeholder:text-[#686960]/50 focus:border-[#24251F] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-mono text-xs text-[#24251F] mb-1.5"
            >
              Kata Sandi
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••••••"
              className="w-full h-11 px-3 text-[16px] rounded-lg border border-[#E5E1D6] bg-[#F5F3EC] text-[#24251F] placeholder:text-[#686960]/50 focus:border-[#24251F] focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="touch-target w-full rounded-lg bg-[#24251F] text-[#FFFEFA] text-sm font-medium inline-flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 mt-2"
          >
            <span>{isPending ? 'Memverifikasi...' : 'Masuk ke Dashboard'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-[#E5E1D6] text-center">
          <p className="text-[11px] font-mono text-[#686960]">
            Pendaftaran akun publik dimatikan demi keamanan.
          </p>
        </div>
      </div>
    </div>
  );
}
