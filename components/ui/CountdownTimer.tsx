'use client';
import { useEffect, useState } from 'react';

const TARGET = new Date('2026-06-08T09:00:00+08:00');

export function CountdownTimer() {
  const [time, setTime] = useState<{d: number, h: number, m: number, s: number}>({ d: 0, h: 0, m: 0, s: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const diff = Math.max(0, Math.floor((TARGET.getTime() - Date.now()) / 1000));
      setTime({ 
        d: Math.floor(diff / 86400), 
        h: Math.floor(diff % 86400 / 3600),
        m: Math.floor(diff % 3600 / 60), 
        s: diff % 60 
      });
    };
    tick(); 
    const id = setInterval(tick, 1000); 
    return () => clearInterval(id);
  }, []);

  if (!mounted) return <div className="h-[60px]" />;

  const units = [
    {label: 'Days', key: 'd' as const}, 
    {label: 'Hrs', key: 'h' as const}, 
    {label: 'Min', key: 'm' as const}, 
    {label: 'Sec', key: 's' as const}
  ];

  return (
    <div className="flex gap-2 mb-4">
      {units.map(({label, key}) => (
        <div key={key} className="bg-white/7 border border-white/10 rounded-lg px-3 py-2 text-center min-w-[52px]">
          <span className="block text-xl font-bold text-white leading-none">
            {String(time[key]).padStart(2,'0')}
          </span>
          <span className="block text-[8px] font-bold uppercase tracking-widest2 text-indigo mt-0.5">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
