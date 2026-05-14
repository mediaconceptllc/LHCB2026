import Image from 'next/image';
import Link from 'next/link';
import type { Speaker } from '@/data/speakers';

export function SpeakerCard({ speaker, locale }: { speaker: Speaker; locale: string }) {
  return (
    <Link
      href={`/${locale}/speakers/${speaker.slug}`}
      className="group bg-white border border-slate-200 rounded-3xl p-6 flex gap-6
                 hover:shadow-xl hover:border-indigo/30 hover:-translate-y-1
                 transition-all duration-300"
    >
      {/* Avatar */}
      <div
        className="w-32 h-32 rounded-2xl bg-indigo/10 border border-indigo/20
                   flex items-center justify-center text-sm font-bold text-indigo
                   flex-shrink-0 overflow-hidden relative"
      >
        {speaker.photo ? (
          <Image
            src={speaker.photo}
            alt={speaker.name}
            fill
            className="object-cover"
          />
        ) : (
          <span className="text-2xl">{speaker.initials}</span>
        )}
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1 py-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <p className="text-base font-bold text-navy-800 group-hover:text-indigo transition-colors leading-tight">
            {speaker.name}
          </p>
          <span className="text-xl flex-shrink-0">{speaker.flag}</span>
        </div>
        <p className="text-sm text-indigo font-bold mt-1">{speaker.title}</p>
        <p className="text-sm text-slate-500 mt-1 truncate font-medium">{speaker.institution}</p>
        <p className="text-xs text-slate-400 mt-3 leading-relaxed line-clamp-3">{speaker.specialty}</p>
      </div>
    </Link>
  );
}
