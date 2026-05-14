import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tv, Users, Mic2, Star } from 'lucide-react';

export default function PublicLecturePage() {
  const t = useTranslations('Navigation');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-32 bg-navy-900 overflow-hidden">
        <div className="absolute inset-0 bg-dot-grid opacity-20" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo rounded-full blur-[160px] opacity-20" />
        
        <div className="max-w-[1240px] mx-auto px-6 md:px-12 relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center text-white">
          <div>
            <Badge className="bg-indigo text-white px-4 py-1.5 rounded-full mb-8 font-bold tracking-widest text-[10px] uppercase border-none">
              Featured Public Event
            </Badge>
            <h1 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              Science <span className="text-indigo">Unveiled</span> <br /> 
              at Ulaanbaatar Hotel
            </h1>
            <p className="text-xl text-slate-400 mb-10 leading-relaxed max-w-lg">
              Join us for an evening of inspiring talks and a panel discussion featuring the world's leading physicists. Open to the general public.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-white text-navy-900 hover:bg-slate-100 font-bold h-14 px-10 text-lg">
                Get Free Tickets
              </Button>
              <div className="flex items-center gap-3 px-6 h-14 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-sm font-bold tracking-widest uppercase">Live on CNBC Mongolia</span>
              </div>
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden border border-white/10 shadow-2xl">
            <Image 
              src="/speakers/Tomasz Skwarnicki_Wonder 3.png" 
              alt="Public Event" 
              fill 
              className="object-cover" 
            />
            <div className="absolute bottom-0 left-0 w-full p-8 bg-gradient-to-t from-navy-900 via-navy-900/60 to-transparent">
               <p className="text-sm font-bold text-indigo uppercase tracking-widest mb-1">June 9, 2026</p>
               <h3 className="text-2xl font-bold">15:30 - 17:30</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Mic2, title: 'Keynote Lectures', desc: 'Three intensive 20-minute talks designed for a general audience.' },
              { icon: Users, title: 'Panel Discussion', desc: 'A moderated Q&A session with 6 world-renowned scientists.' },
              { icon: Tv, title: 'Media Coverage', desc: 'Broadcasting live to thousands of viewers nationwide.' },
            ].map((f, i) => (
              <Card key={i} className="rounded-3xl border-slate-100 bg-white p-4">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-2xl bg-indigo/10 flex items-center justify-center text-indigo mb-6">
                    <f.icon className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-navy-800 text-lg mb-2">{f.title}</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Program Section */}
      <section className="py-24">
        <div className="max-w-[1240px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <SectionHeader 
                eyebrow="Schedule"
                title="Public Lecture Program"
                lead="A fast-paced, high-energy event designed to showcase the excitement of particle physics."
              />
              
              <div className="mt-12 space-y-4">
                {[
                  { time: '15:30', title: 'Grand Opening', desc: 'Welcome remarks and introduction to the world of CERN.' },
                  { time: '15:45', title: 'Lecture 1: The Smallest Building Blocks', desc: 'Understanding the subatomic world.' },
                  { time: '16:05', title: 'Lecture 2: The Big Bang & Particle Physics', desc: 'How LHC mimics the early universe.' },
                  { time: '16:25', title: 'Lecture 3: Future of Technology', desc: 'How CERN tech impacts our daily lives.' },
                  { time: '16:45', title: 'Panel Discussion', desc: 'Live Q&A with the masters of physics.' },
                  { time: '17:30', title: 'Event Close', desc: 'Networking and student interactions.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 p-6 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors group">
                    <span className="text-indigo font-mono font-bold w-12 flex-shrink-0">{item.time}</span>
                    <div>
                      <h4 className="font-bold text-navy-800 group-hover:text-indigo transition-colors">{item.title}</h4>
                      <p className="text-sm text-slate-500 mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              <div className="p-10 bg-navy-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                <Star className="absolute -top-4 -right-4 h-32 w-32 text-indigo opacity-10" />
                <h3 className="text-2xl font-bold mb-6">Special Guests</h3>
                <div className="space-y-6">
                  {[
                    { name: 'Prof. Tim Gershon', role: 'B-Physics Pioneer' },
                    { name: 'Prof. Vincenzo Vagnoni', role: 'HEP Expert' },
                    { name: 'Prof. Tomasz Skwarnicki', role: 'Discovery Leader' },
                  ].map((guest, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-bold">{guest.name}</p>
                        <p className="text-xs text-slate-400 uppercase tracking-widest">{guest.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-10 bg-indigo hover:bg-indigo-dark text-white font-bold h-12 rounded-xl">
                  Meet All Speakers
                </Button>
              </div>

              <div className="p-10 bg-slate-50 border border-slate-100 rounded-[40px]">
                <h4 className="font-bold text-navy-800 mb-4">Live Broadcast</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Can't make it to Ulaanbaatar Hotel? Watch the entire event live on CNBC Mongolia and our YouTube channel.
                </p>
                <div className="flex items-center gap-4">
                   <div className="h-10 w-24 relative grayscale opacity-60">
                     <Image src="/logos/CNBCLogo.png" alt="CNBC" fill className="object-contain" />
                   </div>
                   <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Official Media Partner</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
