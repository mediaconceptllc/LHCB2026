import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { speakers } from '@/data/speakers';
import { Button } from '@/components/ui/button';
import { ChevronLeft, Globe, Mail } from 'lucide-react';
import Link from 'next/link';

export default async function SpeakerDetailPage({ params }: { params: Promise<{ slug: string; locale: string }> }) {
  const { slug, locale } = await params;
  const speaker = speakers.find((s) => s.slug === slug);

  if (!speaker) notFound();

  const t = await getTranslations({ locale, namespace: 'Speakers' });

  return (
    <div className="min-h-screen bg-white">
      {/* Header / Hero */}
      <section className="bg-navy-900 py-20 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06] select-none overflow-hidden">
          <div className="absolute top-4 right-8 text-[12rem] font-black leading-none">{speaker.initials}</div>
        </div>

        <div className="max-w-[1240px] mx-auto px-6 md:px-12 relative z-10">
          <Link
            href={`/${locale}/speakers`}
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-10 text-sm font-medium"
          >
            <ChevronLeft className="h-4 w-4" />
            {t('back')}
          </Link>

          <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
            {/* Photo */}
            <div className="w-80 h-80 rounded-[2rem] bg-indigo/20 border border-white/10 flex-shrink-0 overflow-hidden relative shadow-2xl">
              {speaker.photo ? (
                <Image src={speaker.photo} alt={speaker.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-7xl font-bold text-indigo/60">
                  {speaker.initials}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="text-center md:text-left">
              <span className="inline-block text-indigo font-bold tracking-widest2 uppercase text-xs mb-3 px-3 py-1 bg-indigo/10 rounded-full border border-indigo/20">
                {speaker.title}
              </span>
              <h1 className="text-4xl md:text-5xl font-extrabold mb-3 leading-tight">
                {speaker.name} <span className="text-2xl">{speaker.flag}</span>
              </h1>
              <p className="text-lg text-slate-300 mb-2">{speaker.institution}</p>
              <p className="text-slate-500 text-sm mb-8">{speaker.country}</p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <Button size="sm" variant="ghost" className="border border-white/20 text-white hover:bg-white/10 gap-2 rounded-xl">
                  <Globe className="h-4 w-4" />
                  {t('website')}
                </Button>
                <Button size="sm" variant="ghost" className="border border-white/20 text-white hover:bg-white/10 gap-2 rounded-xl">
                  <Mail className="h-4 w-4" />
                  {t('contact_btn')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* Biography — both languages */}
            <div className="lg:col-span-2 space-y-10">
              <div>
                <h2 className="text-xl font-bold text-navy-800 mb-5 flex items-center gap-3">
                  <span className="w-1 h-6 bg-indigo rounded-full inline-block" />
                  {t('biography')}
                </h2>

                {/* Mongolian bio */}
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-4">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-indigo mb-3">🇲🇳 Монгол</span>
                  <p className="text-slate-600 leading-relaxed text-base">{speaker.bio_mn}</p>
                </div>

                {/* English bio */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">🇬🇧 English</span>
                  <p className="text-slate-600 leading-relaxed text-base">{speaker.bio_en}</p>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Specialty */}
              <div className="bg-slate-50 rounded-3xl p-7 border border-slate-100">
                <h3 className="font-bold text-navy-800 mb-5 uppercase tracking-widest text-xs">{t('specialty')}</h3>
                <div className="flex flex-wrap gap-2">
                  {speaker.specialty.split(';').map((s, i) => (
                    <span
                      key={i}
                      className="bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600"
                    >
                      {s.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Institution */}
              <div className="bg-slate-50 rounded-3xl p-7 border border-slate-100">
                <h3 className="font-bold text-navy-800 mb-5 uppercase tracking-widest text-xs">{t('institution')}</h3>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl border border-slate-200 flex items-center justify-center text-xl flex-shrink-0">
                    🏛️
                  </div>
                  <div>
                    <p className="font-bold text-navy-800 text-sm">{speaker.institution}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{speaker.country} {speaker.flag}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
