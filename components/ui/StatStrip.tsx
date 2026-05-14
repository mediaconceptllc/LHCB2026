import { useTranslations } from 'next-intl';

export function StatStrip() {
  const t = useTranslations('Stats');

  const stats = [
    { label: t('date_label'),      value: t('date_value') },
    { label: t('location_label'),    value: t('location_value') },
    { label: t('speakers_label'),  value: t('speakers_value') },
    { label: t('attendees_label'),  value: t('attendees_value') },
  ];

  return (
    <div className="bg-navy-900/90 backdrop-blur-md border-t border-white/8">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <div key={i} className={`py-4 pl-5 border-r border-white/8 last:border-none`}>
            <p className="text-[9.5px] font-bold uppercase tracking-widest2 text-indigo mb-0.5">{s.label}</p>
            <p className="text-lg font-bold text-white">{s.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
