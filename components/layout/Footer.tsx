import Link from 'next/link';
import Image from 'next/image';
import { getLocale } from 'next-intl/server';
import { partners } from '@/data/organizations';

export async function Footer() {
  const locale = await getLocale();

  const links = [
    { href: `/${locale}/about`,    label: locale === 'mn' ? 'ТББ-ын тухай' : 'About NGO' },
    { href: `/${locale}/speakers`, label: locale === 'mn' ? 'Зочин илтгэгчид'  : 'Speakers' },
    { href: `/${locale}/agenda`,   label: locale === 'mn' ? 'Хөтөлбөр'         : 'Agenda' },
    { href: `/${locale}/contact`,  label: locale === 'mn' ? 'Холбоо барих'      : 'Contact' },
  ];

  return (
    <footer className="border-t bg-slate-50">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">

          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-3 mb-6">
              <div className="relative h-12 w-12 flex-shrink-0">
                <Image
                  src="/logos/SDAlogo.svg"
                  alt="Science Development Accelerator"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-base tracking-tight text-navy-800 uppercase">
                  Science Development
                </span>
                <span className="font-bold text-base tracking-tight text-indigo uppercase">
                  Accelerator
                </span>
              </div>
            </Link>
            <p className="text-slate-500 max-w-sm mb-6 leading-relaxed text-sm">
              {locale === 'mn'
                ? 'Mongolia-CERN LHCb 2026 — Монгол Улс дахь дэлхийн түвшний бөөмийн физикийн хурал. Улаанбаатар хотод 2026 оны 6-р сарын 8–12-нд болно.'
                : 'Mongolia-CERN LHCb 2026 — A world-class particle physics conference in Mongolia. Ulaanbaatar, June 8–12, 2026.'}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-navy-800 mb-5">
              {locale === 'mn' ? 'Хурдан холбоос' : 'Quick Links'}
            </h4>
            <div className="flex flex-col gap-2.5">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-slate-500 hover:text-indigo transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-widest text-navy-800 mb-5">
              {locale === 'mn' ? 'Холбоо барих' : 'Contact'}
            </h4>
            <div className="flex flex-col gap-2 text-sm text-slate-500">
              <a
                href="mailto:erkhembayar@sciencedev.edu.mn"
                className="hover:text-indigo transition-colors break-all"
              >
                erkhembayar@sciencedev.edu.mn
              </a>
              <p className="text-xs">
                {locale === 'mn'
                  ? 'Улаанбаатар хот, Хан-Уул дүүрэг, 1-р хороо, Энхтайвны өргөн чөлөө, Наран хотхон, 21в, 2 тоот'
                  : 'Naran Khotkhon 21v-2, Peace Avenue, 1st Khoroo, Khan-Uul District, Ulaanbaatar'}
              </p>
              <p className="font-bold text-navy-800">+976 9811 5512, 9960 2999</p>
            </div>
          </div>

        </div>

        {/* Partners bar */}
        <div className="border-t pt-14">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-10 text-center">
            {locale === 'mn' ? 'Зохион байгуулагч & Түншүүд' : 'Organizers & Partners'}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 mb-14">
            {partners.map((p) => (
              <a
                key={p.name}
                href={p.url !== '#' ? p.url : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-14 w-40 md:w-56 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300"
              >
                <Image src={p.logo} alt={p.name} fill className="object-contain" />
              </a>
            ))}
          </div>
          <p className="text-center text-xs text-slate-400">
            © 2026 Science Development Accelerator NGO. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}
