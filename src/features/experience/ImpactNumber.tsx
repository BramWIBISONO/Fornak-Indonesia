import { useEffect, useRef, useState } from 'react';

export function ImpactNumber({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [label, setLabel] = useState(value);
  useEffect(() => {
    if (!ref.current || matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const target = Number(value.replace(/\D/g, ''));
      function update(now: number) {
        const t = Math.min(1, (now - start) / 750);
        setLabel(Math.round(target * (1 - (1-t)**3)).toLocaleString('id-ID') + (value.endsWith('+') ? '+' : ''));
        if (t < 1) frame = requestAnimationFrame(update);
      }
      frame = requestAnimationFrame(update);
    });
    observer.observe(ref.current);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <span ref={ref}><span aria-hidden="true">{label}</span><span className="sr-only">{value}</span></span>;
}
