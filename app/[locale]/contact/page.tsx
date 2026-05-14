import { useTranslations } from 'next-intl';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Globe, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const t = useTranslations('Contact');

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">

        <div className="mb-16">
          <SectionHeader
            eyebrow={t('eyebrow')}
            title={t('title')}
            lead={t('lead')}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Contact Info Cards */}
          <div className="space-y-5">
            <Card className="border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo/10 flex items-center justify-center text-indigo flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-800 text-sm mb-1">{t('email_title')}</h4>
                  <p className="text-slate-500 text-sm">{t('email_general')}</p>
                  <p className="text-slate-500 text-sm">{t('email_sponsor')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo/10 flex items-center justify-center text-indigo flex-shrink-0">
                  <Globe className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-800 text-sm mb-1">{t('phone_title')}</h4>
                  <a
                    href="https://sciencedev.edu.mn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo text-sm font-medium hover:underline"
                  >
                    {t('phone_value')}
                  </a>
                  <p className="text-slate-500 text-sm mt-0.5">{t('phone_hours')}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-indigo/10 flex items-center justify-center text-indigo flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-800 text-sm mb-1">{t('office_title')}</h4>
                  <p className="text-slate-500 text-sm">{t('office_address')}</p>
                  <p className="text-slate-500 text-sm">{t('office_detail')}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl p-8 md:p-12 border border-slate-100 shadow-sm">
              <h3 className="text-2xl font-bold text-navy-800 mb-8">{t('form_title')}</h3>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('name_label')}</label>
                    <Input
                      placeholder={t('name_placeholder')}
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('email_label')}</label>
                    <Input
                      type="email"
                      placeholder={t('email_placeholder')}
                      className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('subject_label')}</label>
                  <Input
                    placeholder={t('subject_placeholder')}
                    className="h-12 rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">{t('message_label')}</label>
                  <Textarea
                    placeholder={t('message_placeholder')}
                    className="min-h-[160px] rounded-xl bg-slate-50 border-slate-200 focus:bg-white p-4 resize-none"
                  />
                </div>

                <Button className="w-full h-14 bg-indigo hover:bg-indigo-dark text-white font-bold rounded-xl gap-2 text-base">
                  <Send className="h-5 w-5" />
                  {t('send_btn')}
                </Button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
