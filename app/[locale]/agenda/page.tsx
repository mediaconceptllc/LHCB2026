import { useTranslations, useLocale } from 'next-intl';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { AgendaRow } from '@/components/ui/AgendaRow';
import { agenda } from '@/data/agenda';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download } from 'lucide-react';

export default function AgendaPage() {
  const t = useTranslations('Agenda');
  const locale = useLocale();

  const days = [
    { num: 1, date: 'June 8',  date_mn: '6/8', theme_mn: 'Нээлт & Детектор', theme_en: 'Opening & Detector' },
    { num: 2, date: 'June 9',  date_mn: '6/9', theme_mn: 'Физик & Лекц', theme_en: 'Physics & Lecture' },
  ] as const;

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">

        <div className="mb-14">
          <SectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
            lead={t('lead')}
          />
        </div>

        <Tabs defaultValue="1" className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-auto bg-white border border-slate-200 rounded-2xl p-1.5 mb-10 shadow-sm gap-1 max-w-md mx-auto">
            {days.map((day) => (
              <TabsTrigger
                key={day.num}
                value={day.num.toString()}
                className="rounded-xl data-[state=active]:bg-indigo data-[state=active]:text-white data-[state=active]:shadow-md flex flex-col gap-0.5 py-3 transition-all"
              >
                <span className="text-[9px] font-bold uppercase tracking-widest opacity-60">
                  {t('day')} {day.num}
                </span>
                <span className="font-bold text-sm">{locale === 'mn' ? day.date_mn : day.date}</span>
                <span className="text-[9px] opacity-70 hidden md:block">
                  {locale === 'mn' ? day.theme_mn : day.theme_en}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {days.map((day) => {
            const items = agenda.filter(item => item.day === day.num);
            return (
              <TabsContent
                key={day.num}
                value={day.num.toString()}
                className="mt-0"
              >
                <div className="bg-white rounded-3xl border border-slate-100 p-8 md:p-12 shadow-sm mb-10">
                  {/* Day header */}
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 rounded-[2rem] bg-indigo text-white flex items-center justify-center shadow-lg shadow-indigo/20">
                      <span className="font-black text-2xl">{day.num}</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-navy-800 text-2xl md:text-3xl mb-1">
                        {locale === 'mn' ? day.theme_mn : day.theme_en}
                      </h2>
                      <p className="text-slate-400 font-medium">
                        {locale === 'mn' ? day.date_mn : day.date}, 2026 — {t('day')} {day.num}
                      </p>
                    </div>
                  </div>

                  <div className="relative">
                    {items.map((item, i) => (
                      <AgendaRow key={i} item={item} locale={locale} />
                    ))}
                  </div>

                  {items.length === 0 && (
                    <div className="py-20 text-center text-slate-300 font-bold italic">
                      {t('no_sessions')}
                    </div>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Download CTA */}
        <div className="mt-14 flex flex-col md:flex-row gap-8 items-center justify-between bg-navy-900 rounded-3xl p-8 md:p-12 text-white overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">{t('download_title')}</h3>
            <p className="text-slate-400 text-sm">{t('download_desc')}</p>
          </div>
          <button className="relative z-10 flex items-center gap-3 bg-white text-navy-900 px-8 py-4 rounded-xl font-bold hover:bg-slate-100 transition-all shadow-xl flex-shrink-0">
            <Download className="h-5 w-5" />
            {t('download_btn')}
          </button>
          <div className="absolute right-0 top-0 h-full w-1/3 bg-indigo opacity-10 -skew-x-12 translate-x-12 pointer-events-none" />
        </div>

      </div>
    </div>
  );
}
