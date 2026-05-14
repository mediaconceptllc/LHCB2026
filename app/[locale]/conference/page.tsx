import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Calendar, Clock, Users } from 'lucide-react';
import Link from 'next/link';

export default function ConferencePage() {
  const t = useTranslations('Navigation');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] flex items-center bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <Image
            src="/speakers/cernTrip2.webp"
            alt="NUM Venue"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 to-transparent" />
        
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 relative z-10 w-full text-white">
          <span className="inline-block text-indigo font-bold tracking-widest2 uppercase text-xs mb-4">Scientific Event</span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
            2-Day Scientific <br className="hidden md:block" /> Conference at NUM
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl leading-relaxed">
            The core academic event of LHCb 2026, bringing together international physicists and Mongolian researchers for intensive knowledge exchange.
          </p>
        </div>
      </section>

      {/* Info Blocks */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Calendar, title: 'Dates', desc: 'June 8-9, 2026' },
            { icon: MapPin, title: 'Venue', desc: 'National University of Mongolia (NUM)' },
            { icon: Clock, title: 'Schedule', desc: '9:00 AM - 6:00 PM Daily' },
            { icon: Users, title: 'Audience', desc: 'Researchers, Students, Faculty' },
          ].map((item, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo/10 flex items-center justify-center text-indigo mb-6">
                <item.icon className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-navy-800 mb-2">{item.title}</h4>
              <p className="text-sm text-slate-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
            <SectionHeader
              eyebrow="The Program"
              title="Topics & Focus Areas"
              lead="The conference will cover the latest developments in particle physics, focusing on the LHCb experiment's contributions to our understanding of the universe."
            />
            
            <div className="mt-12 space-y-8">
              {[
                { title: 'Heavy Flavor Physics', desc: 'Deep dive into CP violation, rare decays, and spectroscopy of charm and beauty hadrons.' },
                { title: 'Detector Technology', desc: 'Updates on the LHCb upgrade, silicon trackers, and real-time data processing.' },
                { title: 'Computing & AI', desc: 'Machine learning applications in high-energy physics and grid computing infrastructure.' },
                { title: 'Theoretical Frameworks', desc: 'Connecting experimental results with New Physics models and Standard Model predictions.' },
              ].map((topic, i) => (
                <div key={i} className="flex gap-6">
                  <div className="w-8 h-8 rounded-full bg-indigo text-white flex items-center justify-center font-bold text-sm flex-shrink-0 mt-1">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-navy-800 text-lg mb-2">{topic.title}</h4>
                    <p className="text-slate-500 leading-relaxed">{topic.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
             <Card className="rounded-[40px] overflow-hidden border-slate-100 shadow-xl">
               <div className="aspect-video relative">
                 <Image src="/speakers/Patrick Robbe_OK.png" alt="Speaker" fill className="object-cover" />
               </div>
               <CardContent className="p-10">
                 <h3 className="text-2xl font-bold text-navy-800 mb-4">Academic Networking</h3>
                 <p className="text-slate-500 leading-relaxed mb-8">
                   We provide dedicated time for informal discussions between international speakers and Mongolian students. This is a unique opportunity to discuss PhD prospects and collaborative research.
                 </p>
                 <Link href="agenda">
                  <Button className="w-full h-14 bg-navy-900 hover:bg-navy-800 text-white font-bold rounded-2xl text-lg">
                    View Detailed Agenda
                  </Button>
                 </Link>
               </CardContent>
             </Card>

             <div className="bg-indigo-light border border-indigo-mid p-10 rounded-[40px]">
               <h4 className="font-bold text-indigo mb-4 uppercase tracking-widest text-xs text-center">Registration Fee</h4>
               <div className="text-center">
                 <span className="text-4xl font-black text-navy-800">FREE</span>
                 <p className="text-slate-500 mt-2 text-sm max-w-xs mx-auto">Thanks to our sponsors, participation is free for all registered Mongolian students and faculty.</p>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-slate-50 border-t">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 text-center">
          <h2 className="text-3xl font-bold text-navy-800 mb-8">Ready to Attend?</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <Button size="lg" className="bg-indigo hover:bg-indigo-dark text-white font-bold h-14 px-12">
              Register Now
            </Button>
            <Button size="lg" variant="outline" className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50 h-14 px-12">
              Download Program PDF
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
