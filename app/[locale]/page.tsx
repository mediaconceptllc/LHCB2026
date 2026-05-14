import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StatStrip } from '@/components/ui/StatStrip';
import { CountdownTimer } from '@/components/ui/CountdownTimer';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { partners } from '@/data/organizations';

export default function HomePage() {
  const t = useTranslations('Index');
  const locale = useLocale();
  const nav = useTranslations('Navigation');

  const valueCards = [
    { icon: '🌍', titleKey: 'impact_title', descKey: 'impact_desc', color: 'bg-blue-50 border-blue-100' },
    { icon: '🌱', titleKey: 'growth_title', descKey: 'growth_desc', color: 'bg-green-50 border-green-100' },
    { icon: '⚡', titleKey: 'innovation_title', descKey: 'innovation_desc', color: 'bg-amber-50 border-amber-100' },
    { icon: '🎓', titleKey: 'education_title', descKey: 'education_desc', color: 'bg-purple-50 border-purple-100' },
  ] as const;

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden bg-navy-900 glow-indigo">
        <div className="absolute inset-0 z-0 opacity-30">
          <Image
            src="/speakers/cernTrip2.webp"
            alt="CERN LHCb"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
        {/* gradient fade at bottom */}
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-navy-900 via-navy-900/60 to-transparent" />

        <div className="max-w-[1240px] mx-auto px-6 md:px-12 relative z-10 w-full">
          <div className="max-w-3xl">
            <span className="inline-block text-indigo font-bold tracking-widest2 uppercase text-xs mb-6 px-3 py-1 bg-indigo/10 rounded-full border border-indigo/20">
              {t('hero_eyebrow')}
            </span>
            <h1 className="text-[clamp(2.5rem,6vw,4.5rem)] font-extrabold tracking-tight text-white leading-[1.1] mb-8">
              {t('hero_title')}
            </h1>
            <p className="text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              {t('hero_sub')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="#event">
                <Button size="lg" className="bg-indigo hover:bg-indigo-dark text-white font-bold h-14 px-8 text-lg">
                  {t('hero_cta1')}
                </Button>
              </Link>
              <Link href={`/${locale}/about`}>
                <Button size="lg" variant="ghost" className="border border-white/30 text-white hover:bg-white/10 h-14 px-8 text-lg">
                  {t('hero_cta2')}
                </Button>
              </Link>
            </div>
            <p className="text-slate-500 text-sm mt-12 font-medium">
              {t('hero_cred')}
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatStrip />

      {/* Mission / Value Cards Section */}
      <section className="py-24 bg-white">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <SectionHeader
              eyebrow={t('mission_eyebrow')}
              title={t('mission_title')}
              lead={t('mission_lead')}
            />
            <div className="mt-8">
              <Button variant="link" className="text-indigo font-bold p-0 text-base">
                {t('mission_link')}
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {valueCards.map((card) => (
              <div
                key={card.titleKey}
                className={`p-6 rounded-2xl border ${card.color} hover:shadow-md transition-shadow`}
              >
                <span className="text-3xl mb-3 block">{card.icon}</span>
                <h4 className="font-bold text-navy-800 mb-2">{t(card.titleKey)}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{t(card.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Details Card Section */}
      <section id="event" className="py-24 bg-slate-50">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          <div className="flex flex-col justify-center">
            <h2 className="text-4xl font-bold text-navy-800 mb-6">
              {t('event_title')}
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed mb-8">
              {t('event_desc')}
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-navy-800 font-semibold">
                <div className="w-10 h-10 rounded-full bg-indigo/10 flex items-center justify-center text-indigo flex-shrink-0">📍</div>
                <span>{t('event_location')}</span>
              </div>
              <div className="flex items-center gap-4 text-navy-800 font-semibold">
                <div className="w-10 h-10 rounded-full bg-indigo/10 flex items-center justify-center text-indigo flex-shrink-0">📅</div>
                <span>{t('event_dates')}</span>
              </div>
            </div>
          </div>

          <div className="bg-navy-900 rounded-3xl p-8 md:p-12 text-white flex flex-col justify-center border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-[0.07] select-none">
              <span className="text-9xl font-bold">26</span>
            </div>
            <p className="text-indigo font-bold uppercase tracking-widest text-xs mb-4">{t('countdown_label')}</p>
            <h3 className="text-3xl font-bold mb-8">{t('countdown_title')}</h3>
            <CountdownTimer />
            <Link href={`/${locale}/contact`}>
              <Button className="w-full bg-white text-navy-900 hover:bg-slate-100 font-bold h-14 text-base mt-4">
                {t('notify_btn')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 border-t border-b bg-white">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-12">
            {t('partners_label')}
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16">
            {partners.map((p) => (
              <a
                key={p.name}
                href={p.url !== '#' ? p.url : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className="relative h-12 w-28 md:w-36 grayscale hover:grayscale-0 opacity-50 hover:opacity-100 transition-all duration-300"
              >
                <Image 
                  src={p.logo} 
                  alt={p.name} 
                  fill 
                  className={`object-contain ${p.name === 'Ulaanbaatar Hotel' ? 'scale-[2.2]' : ''}`} 
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Join CTA */}
      <section className="py-32 bg-navy-900 text-center relative overflow-hidden bg-dot-grid">
        <div className="relative z-10 max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
            {t('cta_title')}
          </h2>
          <p className="text-slate-400 text-lg mb-12 leading-relaxed">
            {t('cta_desc')}
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link href={`/${locale}/sponsor`}>
              <Button size="lg" className="bg-indigo hover:bg-indigo-dark text-white font-bold h-14 px-10">
                {t('cta_sponsor')}
              </Button>
            </Link>
            <Link href={`/${locale}/contact`}>
              <Button size="lg" variant="ghost" className="border border-white/20 text-white hover:bg-white/10 h-14 px-10">
                {t('cta_contact')}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
