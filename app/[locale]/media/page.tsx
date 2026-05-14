import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, FileText, Download, Camera } from 'lucide-react';

export default function MediaPage() {
  const t = useTranslations('Navigation');

  return (
    <div className="py-24 bg-white min-h-screen">
      <div className="max-w-[1240px] mx-auto px-6 md:px-12">
        <div className="mb-20">
          <SectionHeader
            eyebrow="News & Press"
            title="Media Resources"
            lead="Access official press releases, high-resolution assets, and broadcast information for LHCb 2026."
          />
        </div>

        {/* Featured Media Partner */}
        <div className="bg-slate-50 rounded-[40px] p-8 md:p-16 mb-20 flex flex-col lg:flex-row gap-16 items-center">
          <div className="flex-1 order-2 lg:order-1">
             <div className="flex items-center gap-4 mb-8">
               <div className="h-10 w-24 relative grayscale">
                 <Image src="/logos/CNBCLogo.png" alt="CNBC" fill className="object-contain" />
               </div>
               <span className="text-xs font-bold text-slate-400 uppercase tracking-widest border-l pl-4">Exclusive Media Partner</span>
             </div>
             <h2 className="text-3xl font-bold text-navy-800 mb-6">National Broadcast by CNBC Mongolia</h2>
             <p className="text-slate-500 leading-relaxed mb-8 text-lg">
               CNBC Mongolia will provide exclusive live coverage of the Science Unveiled public lecture. In-depth interviews with Dr. Tim Gershon and the organizing committee will be aired throughout the conference week.
             </p>
             <Button className="bg-navy-900 text-white rounded-2xl h-14 px-8 font-bold gap-2">
               <Play className="h-4 w-4 fill-white" />
               Watch Live Stream
             </Button>
          </div>
          <div className="flex-1 order-1 lg:order-2 w-full">
            <div className="aspect-video relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
               <Image src="/speakers/cernTrip2.webp" alt="Media Coverage" fill className="object-cover" />
               <div className="absolute inset-0 bg-navy-900/20" />
            </div>
          </div>
        </div>

        {/* Press Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: FileText, title: 'Press Release', desc: 'Official announcement of the Mongolia-CERN partnership and 2026 event.', file: 'lhcb2026_press_release.pdf' },
            { icon: Camera, title: 'Photo Gallery', desc: 'High-resolution images of speakers, NUM venue, and CERN facilities.', file: 'press_kit_photos.zip' },
            { icon: Download, title: 'Brand Assets', desc: 'Official logos, colors, and typography guidelines for media use.', file: 'brand_kit.zip' },
          ].map((asset, i) => (
            <Card key={i} className="rounded-3xl border-slate-100 hover:shadow-lg transition-all p-4">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center text-navy-800 mx-auto mb-6 border border-slate-100">
                  <asset.icon className="h-8 w-8" />
                </div>
                <h4 className="font-bold text-navy-800 text-xl mb-3">{asset.title}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">{asset.desc}</p>
                <Button variant="outline" className="w-full rounded-xl gap-2 font-bold text-xs uppercase tracking-widest text-slate-600">
                   Download {asset.title.split(' ')[0]}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact for Press */}
        <div className="mt-32 p-12 bg-indigo-light rounded-[40px] border border-indigo-mid text-center">
          <h3 className="text-2xl font-bold text-navy-800 mb-4">Press Inquiries</h3>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto">
            For interview requests, media passes, or filming permissions during the conference, please contact our media relations team.
          </p>
          <div className="font-bold text-indigo text-lg">media@sciencedev.edu.mn</div>
        </div>
      </div>
    </div>
  );
}
