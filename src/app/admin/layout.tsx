import type { Metadata } from 'next';
import React from 'react';
import Link from 'next/link';
import { logoutAdmin } from '@/actions/auth';
import { verifyAdmin } from '@/lib/supabase/server';
import { LogOut, FolderGit2, PenTool, LayoutDashboard } from 'lucide-react';

export const instant = false;

export const metadata: Metadata = {
  title: 'Admin Panel | Tinkerbench Labs',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAdmin } = await verifyAdmin();

  // If not logged in as admin (e.g. on /admin/login), render clean container without admin navbar
  if (!isAdmin) {
    return (
      <div className="min-h-dvh flex flex-col bg-[#F5F3EC]">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex flex-col bg-[#F5F3EC]">
      {/* Admin Top Navigation */}
      <header className="sticky top-0 z-30 bg-[#FFFEFA] border-b border-[#E5E1D6]">
        <div className="max-w-[1120px] mx-auto h-14 px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link
              href="/admin"
              className="touch-target flex items-center gap-2 font-semibold text-sm tracking-tight text-[#24251F]"
            >
              <span className="w-2.5 h-2.5 rounded-sm bg-[#C7E36A] border border-[#24251F]/30" />
              <span>Tinkerbench Admin</span>
            </Link>

            <nav className="hidden sm:flex items-center gap-1 font-mono text-xs">
              <Link
                href="/admin"
                className="touch-target px-2.5 py-1 text-[#686960] hover:text-[#24251F] hover:bg-[#F5F3EC] rounded inline-flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Dashboard
              </Link>
              <Link
                href="/admin/projects"
                className="touch-target px-2.5 py-1 text-[#686960] hover:text-[#24251F] hover:bg-[#F5F3EC] rounded inline-flex items-center gap-1.5"
              >
                <FolderGit2 className="w-3.5 h-3.5" />
                Projects
              </Link>
              <Link
                href="/admin/notes"
                className="touch-target px-2.5 py-1 text-[#686960] hover:text-[#24251F] hover:bg-[#F5F3EC] rounded inline-flex items-center gap-1.5"
              >
                <PenTool className="w-3.5 h-3.5" />
                Notes
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[#686960] hover:text-[#24251F] hidden md:inline-block"
            >
              Buka Web Publik ↗
            </Link>
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="touch-target px-2.5 py-1 text-xs font-mono text-[#B42318] hover:bg-[#B42318]/10 rounded inline-flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="sm:hidden flex items-center justify-around border-t border-[#E5E1D6] bg-[#FFFEFA] py-2 px-2 font-mono text-xs">
          <Link
            href="/admin"
            className="touch-target px-2.5 py-1 text-[#686960] hover:text-[#24251F] inline-flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/admin/projects"
            className="touch-target px-2.5 py-1 text-[#686960] hover:text-[#24251F] inline-flex items-center gap-1.5"
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            <span>Projects</span>
          </Link>
          <Link
            href="/admin/notes"
            className="touch-target px-2.5 py-1 text-[#686960] hover:text-[#24251F] inline-flex items-center gap-1.5"
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Notes</span>
          </Link>
        </div>
      </header>

      {/* Admin Content Area */}
      <main className="flex-1 w-full max-w-[1120px] mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        {children}
      </main>
    </div>
  );
}
