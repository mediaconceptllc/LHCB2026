import { useTranslations } from 'next-intl';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Check, Mail } from 'lucide-react';

export default function SponsorPage() {
  const t = useTranslations('Navigation');

  const tiers = [
    {
      name: 'Platinum',
      price: '$5,000+',
      desc: 'Maximum visibility and premium branding.',
      features: ['Main stage logo placement', 'Live mention in Opening Ceremony', 'Full-page program ad', 'Exhibition booth space', '10 VIP dinner invites'],
      color: 'bg-navy-900 text-white',
      btn: 'bg-indigo hover:bg-indigo-dark text-white'
    },
    {
      name: 'Gold',
      price: '$2,500',
      desc: 'Strategic positioning for leading brands.',
      features: ['Digital logo placement', 'Social media feature', 'Half-page program ad', 'Exhibition table', '5 VIP dinner invites'],
      color: 'bg-white text-navy-800',
      btn: 'bg-navy-900 hover:bg-navy-800 text-white'
    },
    {
      name: 'Silver',
      price: '$1,000',
      desc: 'Essential support for scientific growth.',
      features: ['Website logo placement', 'Program book logo', 'Mention in final report', '2 VIP dinner invites'],
      color: 'bg-white text-navy-800',
      btn: 'bg-indigo hover:bg-indigo-dark text-white'
    }
  ];

  return (
    <div className="py-24 bg-slate-50 min-h-screen">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <div className="mb-20 text-center">
          <SectionHeader
            eyebrow="Sponsorship"
            title="Support the Future of Mongolian Science"
            lead="LHCb 2026 offers unique opportunities for organizations to showcase their commitment to innovation and high-technology research."
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-24">
          {tiers.map((tier) => (
            <Card key={tier.name} className={`rounded-[40px] border-none shadow-xl flex flex-col ${tier.color}`}>
              <CardHeader className="p-10 text-center">
                <CardTitle className="text-sm font-bold uppercase tracking-widest mb-4 opacity-70">{tier.name} Partner</CardTitle>
                <div className="text-4xl font-black mb-4">{tier.price}</div>
                <CardDescription className={tier.color === 'bg-white text-navy-800' ? 'text-slate-500' : 'text-slate-400'}>
                  {tier.desc}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-10 pt-0 flex-1">
                <div className="space-y-4">
                  {tier.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-indigo/20 flex items-center justify-center flex-shrink-0">
                        <Check className="h-3 w-3 text-indigo" />
                      </div>
                      <span className="text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="p-10 pt-0">
                <Button className={`w-full h-12 rounded-xl font-bold ${tier.btn}`}>
                  Select {tier.name}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
           <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm">
             <h3 className="text-2xl font-bold text-navy-800 mb-6">In-Kind Sponsorship</h3>
             <p className="text-slate-500 leading-relaxed mb-8">
               We also welcome in-kind support such as travel grants for students, catering for networking events, or media coverage.
             </p>
             <div className="space-y-4">
               {['Flight Sponsorship', 'Reception Catering', 'Student Prizes', 'Volunteer Uniforms'].map((item, i) => (
                 <div key={i} className="flex items-center gap-3 font-semibold text-navy-800">
                   <div className="w-2 h-2 rounded-full bg-indigo" />
                   {item}
                 </div>
               ))}
             </div>
           </div>

           <div className="bg-indigo p-12 rounded-[40px] text-white flex flex-col justify-center">
             <h3 className="text-2xl font-bold mb-6">Custom Packages</h3>
             <p className="text-indigo-light leading-relaxed mb-8">
               Looking for a specific type of engagement? We can tailor a package to meet your organization's unique goals.
             </p>
             <Button variant="ghost" className="bg-white/10 hover:bg-white/20 text-white font-bold h-14 rounded-2xl gap-2 text-lg">
               <Mail className="h-5 w-5" />
               Contact Secretariat
             </Button>
           </div>
        </div>
      </div>
    </div>
  );
}
