'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Globe, Menu, X } from 'lucide-react';

export function Navbar() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: t('home'), href: `/${locale}` },
    { name: t('about'), href: `/${locale}/about` },
    { name: t('partners'), href: `/${locale}/partners` },
    { name: t('speakers'), href: `/${locale}/speakers` },
    { name: t('agenda'), href: `/${locale}/agenda` },
    { name: t('contact'), href: `/${locale}/contact` },
  ];

  const otherLocale = locale === 'en' ? 'mn' : 'en';
  const otherLocaleName = locale === 'en' ? 'MN' : 'EN';
  const switchPath = pathname.replace(`/${locale}`, `/${otherLocale}`);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 flex h-16 items-center justify-between">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <div className="relative h-10 w-10 flex-shrink-0">
            <Image
              src="/logos/SDAlogo.svg"
              alt="Science Development Accelerator"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-sm tracking-tight text-navy-800 uppercase">
              Science Development
            </span>
            <span className="font-bold text-sm tracking-tight text-indigo uppercase">
              Accelerator
            </span>
          </div>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 hover:text-indigo transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <Link href={switchPath}>
            <Button variant="ghost" size="sm" className="gap-2 text-slate-600">
              <Globe className="h-4 w-4" />
              <span className="font-bold">{otherLocaleName}</span>
            </Button>
          </Link>
          <Button size="sm" className="hidden md:inline-flex bg-indigo hover:bg-indigo-dark text-white font-semibold">
            {t('register')}
          </Button>
          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-slate-600 hover:text-indigo hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-white/95 backdrop-blur-md">
          <div className="max-w-[1240px] mx-auto px-6 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-indigo py-2.5 border-b border-slate-100 last:border-none transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <Button size="sm" className="mt-3 bg-indigo hover:bg-indigo-dark text-white font-semibold w-full">
              {t('register')}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
