import { useTranslations, useLocale } from 'next-intl';
import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Card, CardContent } from '@/components/ui/card';
import { partners } from '@/data/organizations';

export default function AboutPage() {
  const t = useTranslations('About');
  const locale = useLocale();

  // Show all key organizations — organizers + venue partner
  const keyOrgs = partners.filter(p =>
    p.role === 'Organizer' || p.role === 'Venue Partner'
  );

  const boardMembers = [
    {
      name: 'У. Дөлгүүн',
      name_en: 'Dolguun U.',
      role_mn: 'Удирдах Зөвлөлийн дарга',
      role_en: 'Board Chairman',
      photo: '/speakers/dolguun.png',
      initials: 'УД'
    },
    {
      name: 'М. Эрхэмбаяр',
      name_en: 'Erkhembayar M.',
      role_mn: 'Гүйцэтгэх захирал',
      role_en: 'Executive Director',
      photo: '/speakers/erkhembayar.png',
      initials: 'МЭ'
    },
    {
      name: 'Б. Баасансүрэн',
      name_en: 'Baasansuren B.',
      role_mn: 'Удирдах Зөвлөлийн гишүүн',
      role_en: 'Board Member',
      photo: '/speakers/baasansuren1.png',
      initials: 'ББ'
    },
    {
      name: 'Ц. Энхбат',
      name_en: 'Enkhbat Ts.',
      role_mn: 'Удирдах Зөвлөлийн гишүүн',
      role_en: 'Board Member',
      photo: '/speakers/enkhbat.png',
      initials: 'ЦЭ'
    },
    {
      name: 'А. Доржпалам',
      name_en: 'Dorjpalam A.',
      role_mn: 'Удирдах Зөвлөлийн гишүүн',
      role_en: 'Board Member',
      photo: '/speakers/dorjpalam.png',
      initials: 'АД'
    },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <section className="bg-slate-50 py-24 border-b">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <SectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
            lead={t('lead')}
          />
        </div>
      </section>

      {/* Organizations */}
      <section className="py-24">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <h2 className="text-3xl font-bold text-navy-800 mb-12">{t('institutions_title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyOrgs.map((org) => (
              <Card key={org.name} className="overflow-hidden border-slate-100 hover:shadow-xl transition-shadow rounded-2xl group">
                <CardContent className="p-8 flex flex-col h-full">
                  <div className="h-14 w-full relative mb-8 grayscale group-hover:grayscale-0 opacity-70 group-hover:opacity-100 transition-all duration-300">
                    <Image src={org.logo} alt={org.name} fill className="object-contain object-left" />
                  </div>
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-indigo mb-2">
                    {org.role_mn}
                  </span>
                  <h3 className="text-lg font-bold text-navy-800 mb-3">{org.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1">
                    {locale === 'mn' ? org.desc_mn : org.desc_en}
                  </p>
                  {org.url !== '#' && (
                    <a
                      href={org.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo font-bold text-sm hover:underline"
                    >
                      {t('visit')}
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 bg-navy-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 relative z-10">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <span className="text-indigo font-bold uppercase tracking-widest2 text-xs">{t('team_eyebrow')}</span>
            <h2 className="text-4xl font-bold mt-4 mb-6">{t('team_title')}</h2>
            <p className="text-slate-400 text-sm leading-relaxed">{t('team_lead')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
            {boardMembers.map((member, i) => (
              <div key={i} className="text-center group">
                <div className="w-44 h-44 mx-auto rounded-[2rem] bg-white/5 border border-white/10 overflow-hidden relative mb-6 group-hover:border-indigo/40 transition-colors flex items-center justify-center shadow-xl">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={locale === 'mn' ? member.name : member.name_en}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-white/30">{member.initials}</span>
                  )}
                </div>
                <p className="font-bold text-base">
                  {locale === 'mn' ? member.name : member.name_en}
                </p>
                <p className="text-[11px] text-indigo mt-2 uppercase tracking-widest2 font-bold opacity-80">
                  {locale === 'mn' ? member.role_mn : member.role_en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}
