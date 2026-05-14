import React from 'react';
import { EyebrowLabel } from './EyebrowLabel';

interface Props { 
  eyebrow?: string; 
  title: string; 
  lead?: string; 
  center?: boolean;
}

export function SectionHeader({ eyebrow, title, lead, center }: Props) {
  return (
    <div className={center ? 'text-center max-w-2xl mx-auto' : 'max-w-2xl'}>
      {eyebrow && <EyebrowLabel>{eyebrow}</EyebrowLabel>}
      <h2 className="text-[clamp(1.6rem,3vw,2.25rem)] font-bold tracking-tight text-navy-800 mb-3">
        {title}
      </h2>
      {lead && <p className="text-slate-500 leading-relaxed">{lead}</p>}
    </div>
  );
}
