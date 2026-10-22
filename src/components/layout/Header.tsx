'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { siteConfig } from '@/lib/site-config';
import { useTranslation } from '@/lib/i18n/context';
import { LanguageToggle } from './LanguageToggle';

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { label: t.nav.labs, href: '/labs' },
    { label: t.nav.notes, href: '/notes' },
    { label: t.nav.about, href: '/about' },
  ];

  // Close drawer when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Close drawer on Escape key and prevent background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 h-14 bg-[#F5F3EC] border-b border-[#E5E1D6]">
        <div className="max-w-[1120px] mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="touch-target group flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24251F] rounded"
          >
            <span className="w-2.5 h-2.5 rounded-sm bg-[#C7E36A] border border-[#24251F]/30" />
            <span className="font-semibold text-[15px] tracking-tight text-[#24251F] group-hover:opacity-80 transition-opacity">
              {siteConfig.name}
            </span>
          </Link>

          {/* Desktop Navigation (visible on md screens >= 768px) */}
          <div className="hidden md:flex items-center gap-4">
            <nav className="flex items-center gap-1 font-mono text-[14px]">
              {navItems.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`touch-target px-3.5 py-1.5 rounded-md transition-colors ${
                      isActive
                        ? 'font-medium text-[#24251F] bg-[#E5E1D6]/60'
                        : 'text-[#686960] hover:text-[#24251F] hover:bg-[#E5E1D6]/30'
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="h-4 w-[1px] bg-[#E5E1D6]" aria-hidden="true" />
            <LanguageToggle />
          </div>

          {/* Mobile Right Bar: Language Toggle + Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            <LanguageToggle showIcon={false} />
            <button
              type="button"
              aria-label={isOpen ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={isOpen}
              onClick={() => setIsOpen(!isOpen)}
              className="touch-target text-[#24251F] hover:bg-[#E5E1D6]/50 rounded-lg p-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#24251F]"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Panel rendered OUTSIDE <header> to avoid backdrop-filter stacking trap */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-x-0 bottom-0 top-14 z-50 bg-[#F5F3EC] p-6 flex flex-col justify-between overflow-y-auto md:hidden border-b border-[#E5E1D6]"
          style={{ minHeight: 'calc(100dvh - 3.5rem)' }}
        >
          <div className="flex flex-col gap-2 pt-2">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-[#686960] uppercase tracking-wider">
                {t.nav.menuTitle}
              </span>
              <LanguageToggle />
            </div>
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`touch-target px-4 py-3 rounded-lg text-lg font-medium flex items-center justify-between border ${
                    isActive
                      ? 'bg-[#FFFEFA] text-[#24251F] border-[#E5E1D6]'
                      : 'border-transparent text-[#686960] hover:text-[#24251F] hover:bg-[#E5E1D6]/40'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="w-2 h-2 rounded-full bg-[#C7E36A] border border-[#24251F]/40" />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-[#E5E1D6] pt-6 pb-8 mt-8">
            <p className="font-mono text-xs text-[#686960] leading-relaxed mb-4">
              {t.footer.tagline}
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-[#686960]">
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#24251F] underline underline-offset-4"
              >
                {t.nav.github}
              </a>
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="hover:text-[#24251F] underline underline-offset-4"
              >
                {t.nav.about}
              </Link>
              <Link
                href="/privacy"
                onClick={() => setIsOpen(false)}
                className="hover:text-[#24251F] underline underline-offset-4"
              >
                {t.nav.privacy}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
