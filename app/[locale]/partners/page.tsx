import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { partners } from '@/data/organizations';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default function PartnersPage() {
  const t = useTranslations('Partners');
  const locale = useLocale();

  const groups = [
    { role: 'Organizer', title: t('organizers') },
    { role: 'Scientific Partner', title: t('scientific') },
    { role: 'Venue Partner', title: t('venue') },
    { role: 'Hospitality Partner', title: t('hospitality') },
    { role: 'Media Partner', title: t('media') },
  ];

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <div className="mb-16 text-center">
          <SectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
            lead={t('lead')}
          />
        </div>

        <div className="space-y-24">
          {groups.map((group) => {
            const items = partners.filter(p => p.role === group.role);
            if (items.length === 0) return null;

            return (
              <div key={group.role}>
                <h2 className="text-2xl font-bold text-navy-800 mb-10 border-b pb-4 border-slate-200">
                  {group.title}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {items.map((item) => (
                    <Card key={item.name} className="overflow-hidden border-slate-100 hover:shadow-xl transition-all duration-300 rounded-3xl bg-white group">
                      <CardContent className="p-8">
                        <div className={`${item.name === 'Ulaanbaatar Hotel' ? 'h-32' : 'h-20'} w-full relative mb-8 grayscale group-hover:grayscale-0 transition-all duration-500 opacity-80 group-hover:opacity-100`}>
                          <Image
                            src={item.logo}
                            alt={item.name}
                            fill
                            className={`object-contain object-left ${item.name === 'Ulaanbaatar Hotel' ? 'scale-[1.8] origin-left' : ''}`}
                          />
                        </div>
                        <h3 className="text-xl font-bold text-navy-800 mb-3 group-hover:text-indigo transition-colors">
                          {item.name}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6">
                          {locale === 'mn' ? item.desc_mn : item.desc_en}
                        </p>
                        {item.url !== '#' && (
                          <a href={item.url} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" className="rounded-xl gap-2 text-xs font-bold border-slate-200 text-slate-600 hover:text-indigo hover:border-indigo/30 transition-all">
                              {t('visit')}
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </a>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-32 p-12 bg-navy-900 rounded-[40px] text-white text-center relative overflow-hidden border border-white/5 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-full bg-dot-grid opacity-10" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-6">{t('cta_title')}</h3>
            <p className="text-slate-400 mb-10 leading-relaxed text-lg">
              {t('cta_desc')}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href={`/${locale}/contact`}>
                <Button size="lg" className="bg-indigo hover:bg-indigo-dark text-white font-bold h-14 px-10">
                  {t('cta_btn')}
                </Button>
              </Link>
              <Link href={`/${locale}/contact`}>
                <Button size="lg" variant="ghost" className="border border-white/20 text-white hover:bg-white/10 h-14 px-10">
                  {t('cta_contact')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
