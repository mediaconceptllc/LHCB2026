import { useTranslations, useLocale } from 'next-intl';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { SpeakerCard } from '@/components/ui/SpeakerCard';
import { speakers } from '@/data/speakers';

export default function SpeakersPage() {
  const t = useTranslations('Speakers');
  const locale = useLocale();

  const professors = speakers.filter(s => s.title === 'Professor');
  const researchers = speakers.filter(s => s.title !== 'Professor');

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="mb-16">
          <SectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
            lead={t('lead')}
          />
          {/* Stats row */}
          <div className="flex flex-wrap gap-6 mt-8">
            {[
              { value: '16', label: locale === 'mn' ? 'Нийт зочид' : 'Total Speakers' },
              { value: '9', label: locale === 'mn' ? 'Улс' : 'Countries' },
              { value: '8', label: locale === 'mn' ? 'Профессор' : 'Professors' },
              { value: '7', label: locale === 'mn' ? 'Судлаач' : 'Researchers' },
            ].map(stat => (
              <div key={stat.label} className="bg-white border border-slate-100 rounded-2xl px-6 py-3 flex items-center gap-3 shadow-sm">
                <span className="text-2xl font-extrabold text-indigo">{stat.value}</span>
                <span className="text-sm text-slate-500 font-medium">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Professors */}
        <div className="mb-14">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-200 pb-3">
            {locale === 'mn' ? 'Профессорууд' : 'Professors'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {professors.map((speaker) => (
              <SpeakerCard key={speaker.slug} speaker={speaker} locale={locale} />
            ))}
          </div>
        </div>

        {/* Researchers */}
        <div className="mb-16">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-200 pb-3">
            {locale === 'mn' ? 'Судлаачид' : 'Researchers'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {researchers.map((speaker) => (
              <SpeakerCard key={speaker.slug} speaker={speaker} locale={locale} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="p-10 md:p-14 bg-gradient-to-br from-indigo/5 to-indigo/10 rounded-3xl border border-indigo/20 text-center">
          <h3 className="text-2xl font-bold text-navy-800 mb-3">{t('poster_title')}</h3>
          <p className="text-slate-500 max-w-xl mx-auto mb-8 leading-relaxed">
            {t('poster_desc')}
          </p>
          <button className="bg-indigo text-white px-10 py-3 rounded-xl font-bold hover:bg-indigo-dark transition-colors text-sm tracking-wide">
            {t('poster_btn')}
          </button>
        </div>

      </div>
    </div>
  );
}
