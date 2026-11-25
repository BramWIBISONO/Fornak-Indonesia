/**
 * Editorial Cover — Article-specific conceptual artwork system.
 *
 * Each article gets a unique SVG illustration derived from its actual subject
 * matter, rather than generic geometric patterns.
 */

import { useId, type ReactElement } from 'react';

type MotifConfig = {
  bg: string;
  fg: string;
  render: (w: number, h: number) => ReactElement;
};

/* ── Article-specific artwork definitions ─────────────────────────────── */

/** "Indonesia Memanggil" — Converging pathways representing collective calling */
function MotifConvergence(w: number, h: number) {
  return <g fill="currentColor" transform={`translate(${w*.16} ${h*.11})`}>
    <path d="M0 138h318v7H0zm12-10h294v7H12zm12-10h270v7H24z"/>
    {[48,138,228].map((x,i)=><g key={x} transform={`translate(${x} ${i===1?-5:0})`}>
      <path d="M-12 15h58v6h-58zm3 9h52l-5 8H-4zM0 110h36l7 7H-7z"/>
      {Array.from({length:7},(_,n)=><path key={n} d={`M${n*5} 35h3l1 72h-4z`}/>)}
    </g>)}
    <path d="M14 8 159 -11 302 8Z" opacity=".65"/>
  </g>;
}

/** "Amazing Grace" — Scales of justice + archival paper layers */
function MotifJustice(w: number, h: number) {
  const cx = w * 0.5;
  return (
    <g>
      {/* Stacked archival rectangles */}
      {Array.from({ length: 7 }, (_, i) => (
        <rect
          key={i}
          x={w * 0.15 + i * 8}
          y={h * 0.08 + i * 6}
          width={w * 0.6}
          height={h * 0.75}
          rx={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={i === 6 ? 2 : 0.6}
          opacity={i === 6 ? 0.5 : 0.08 + i * 0.03}
          transform={`rotate(${-12 + i * 2} ${cx} ${h * 0.5})`}
        />
      ))}
      {/* Balance beam */}
      <line x1={cx - w * 0.28} y1={h * 0.52} x2={cx + w * 0.28} y2={h * 0.42} stroke="currentColor" strokeWidth={2.5} opacity={0.6} />
      <line x1={cx} y1={h * 0.47} x2={cx} y2={h * 0.75} stroke="currentColor" strokeWidth={2} opacity={0.4} />
      {/* Scale pans */}
      <path d={`M${cx - w * 0.28} ${h * 0.52} q${w * 0.06} ${h * 0.08} ${w * 0.12} 0`} fill="none" stroke="currentColor" strokeWidth={1.5} opacity={0.5} />
      <path d={`M${cx + w * 0.16} ${h * 0.42} q${w * 0.06} ${h * 0.08} ${w * 0.12} 0`} fill="none" stroke="currentColor" strokeWidth={1.5} opacity={0.5} />
      <circle cx={cx} cy={h * 0.47} r={4} fill="currentColor" opacity={0.5} />
    </g>
  );
}

/** "Indonesia di Dalam Tangan Tuhan" — Horizon with radiant light */
function MotifHorizon(w: number, h: number) {
  return (
    <g>
      {/* Radiant lines from horizon */}
      {Array.from({ length: 15 }, (_, i) => {
        const angle = -90 + (i - 7) * 11;
        const rad = (angle * Math.PI) / 180;
        const cx = w * 0.5, cy = h * 0.72;
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(rad) * h * 1.2}
            y2={cy + Math.sin(rad) * h * 1.2}
            stroke="currentColor"
            strokeWidth={i === 7 ? 2.5 : 0.7}
            opacity={0.06 + (14 - Math.abs(i - 7)) / 25}
          />
        );
      })}
      {/* Horizon line */}
      <line x1={0} y1={h * 0.72} x2={w} y2={h * 0.72} stroke="currentColor" strokeWidth={2} opacity={0.4} />
      {/* Gentle landscape contour */}
      <path
        d={`M0 ${h * 0.72}
            Q${w * 0.15} ${h * 0.58} ${w * 0.3} ${h * 0.65}
            Q${w * 0.45} ${h * 0.72} ${w * 0.55} ${h * 0.6}
            Q${w * 0.7} ${h * 0.5} ${w * 0.85} ${h * 0.62}
            Q${w * 0.95} ${h * 0.68} ${w} ${h * 0.72}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        opacity={0.3}
      />
      {/* Sun disc */}
      <circle cx={w * 0.5} cy={h * 0.42} r={22} fill="currentColor" opacity={0.12} />
      <circle cx={w * 0.5} cy={h * 0.42} r={12} fill="currentColor" opacity={0.2} />
    </g>
  );
}

/** "From Kalimantan to Southeast Asia" — Connected geographic contours */
function MotifIslands(w: number, h: number) {
  return (
    <g>
      {/* Island-like organic forms */}
      <path
        d={`M${w * 0.12} ${h * 0.5}
            c${w * 0.05} -${h * 0.15} ${w * 0.12} -${h * 0.2} ${w * 0.2} -${h * 0.12}
            c${w * 0.04} ${h * 0.04} ${w * 0.08} ${h * 0.08} ${w * 0.04} ${h * 0.14}
            c-${w * 0.06} ${h * 0.08} -${w * 0.15} ${h * 0.06} -${w * 0.24} -${h * 0.02}`}
        fill="currentColor"
        opacity={0.12}
        stroke="currentColor"
        strokeWidth={1.5}
      />
      <path
        d={`M${w * 0.52} ${h * 0.4}
            c${w * 0.08} -${h * 0.08} ${w * 0.18} -${h * 0.1} ${w * 0.25} -${h * 0.04}
            c${w * 0.04} ${h * 0.06} ${w * 0.02} ${h * 0.14} -${w * 0.08} ${h * 0.16}
            c-${w * 0.1} ${h * 0.02} -${w * 0.14} -${h * 0.04} -${w * 0.17} -${h * 0.12}`}
        fill="currentColor"
        opacity={0.08}
        stroke="currentColor"
        strokeWidth={1.5}
      />
      {/* Connecting pathways */}
      {[0.3, 0.45, 0.6].map((y, i) => (
        <path
          key={i}
          d={`M${w * 0.3} ${h * y} C${w * 0.4} ${h * (y - 0.05)} ${w * 0.5} ${h * (y + 0.03)} ${w * 0.6} ${h * y}`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
          strokeDasharray="4 6"
          opacity={0.25}
        />
      ))}
      {/* Compass-like mark */}
      <circle cx={w * 0.82} cy={h * 0.25} r={18} fill="none" stroke="currentColor" strokeWidth={1} opacity={0.2} />
      <line x1={w * 0.82} y1={h * 0.25 - 14} x2={w * 0.82} y2={h * 0.25 + 14} stroke="currentColor" strokeWidth={1} opacity={0.3} />
      <line x1={w * 0.82 - 14} y1={h * 0.25} x2={w * 0.82 + 14} y2={h * 0.25} stroke="currentColor" strokeWidth={1} opacity={0.3} />
    </g>
  );
}

/** "Bangsa yang Dahulu Menerima, Kini Mengutus" — Directional transformation */
function MotifTransformation(w: number, h: number) {
  return (
    <g>
      {/* Receiving arrows (inward, left side) */}
      {Array.from({ length: 5 }, (_, i) => {
        const y = h * 0.2 + i * h * 0.14;
        return (
          <g key={'in' + i} opacity={0.15 + i * 0.08}>
            <line x1={0} y1={y} x2={w * 0.35} y2={h * 0.5} stroke="currentColor" strokeWidth={1.2} />
            <circle cx={w * 0.02} cy={y} r={3} fill="currentColor" />
          </g>
        );
      })}
      {/* Central transformation point */}
      <circle cx={w * 0.42} cy={h * 0.5} r={8} fill="currentColor" opacity={0.25} />
      <circle cx={w * 0.42} cy={h * 0.5} r={16} fill="none" stroke="currentColor" strokeWidth={1.5} opacity={0.15} />
      {/* Sending arrows (outward, right side) */}
      {Array.from({ length: 7 }, (_, i) => {
        const angle = -60 + i * 20;
        const rad = (angle * Math.PI) / 180;
        const len = w * 0.42;
        return (
          <g key={'out' + i} opacity={0.15 + i * 0.06}>
            <line
              x1={w * 0.48}
              y1={h * 0.5}
              x2={w * 0.48 + Math.cos(rad) * len}
              y2={h * 0.5 + Math.sin(rad) * len}
              stroke="currentColor"
              strokeWidth={i === 3 ? 2.5 : 1}
            />
          </g>
        );
      })}
    </g>
  );
}

/** "MSCI dan Ujian Kredibilitas Pasar Indonesia" — Structured economic motifs */
function MotifEconomic(w: number, h: number) {
  return (
    <g>
      {/* Vertical institutional columns */}
      {Array.from({ length: 13 }, (_, i) => {
        const x = w * 0.06 + i * (w * 0.07);
        const baseH = h * (0.3 + Math.sin(i * 0.8) * 0.25 + (i > 6 ? -0.1 : 0.05));
        return (
          <rect
            key={i}
            x={x}
            y={h - baseH}
            width={w * 0.04}
            height={baseH}
            fill="currentColor"
            opacity={0.07 + (i === 7 || i === 8 ? 0.15 : (12 - Math.abs(i - 6)) / 30)}
          />
        );
      })}
      {/* Horizontal grid lines */}
      {Array.from({ length: 5 }, (_, i) => (
        <line
          key={'h' + i}
          x1={w * 0.04}
          y1={h * 0.2 + i * h * 0.15}
          x2={w * 0.96}
          y2={h * 0.2 + i * h * 0.15}
          stroke="currentColor"
          strokeWidth={0.5}
          opacity={0.1}
        />
      ))}
      {/* Trend line */}
      <path
        d={`M${w * 0.08} ${h * 0.65}
            L${w * 0.25} ${h * 0.5}
            L${w * 0.4} ${h * 0.55}
            L${w * 0.55} ${h * 0.35}
            L${w * 0.7} ${h * 0.4}
            L${w * 0.85} ${h * 0.25}`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        opacity={0.4}
      />
    </g>
  );
}

/* ── Motif registry ──────────────────────────────────────────────────── */

const motifConfigs: Record<string, MotifConfig> = {
  convergence: { bg: '#780D23', fg: '#F0C8A5', render: MotifConvergence },
  justice:     { bg: '#3D2214', fg: '#D4B896', render: MotifJustice },
  horizon:     { bg: '#2C1A12', fg: '#E8C9A0', render: MotifHorizon },
  islands:     { bg: '#1A3830', fg: '#9DBFA0', render: MotifIslands },
  transform:   { bg: '#2A1F18', fg: '#C4A882', render: MotifTransformation },
  economic:    { bg: '#1A2630', fg: '#B8A878', render: MotifEconomic },
};

/* ── Article → motif mapping ─────────────────────────────────────────── */

function resolveMotif(category: string, title?: string): string {
  const t = title?.toLowerCase() ?? '';
  if (t.includes('msci') || t.includes('pasar') || t.includes('kredibilitas')) return 'economic';
  if (t.includes('kalimantan') || t.includes('asia') || t.includes('southeast')) return 'islands';
  if (t.includes('amazing grace') || t.includes('hukum') || t.includes('transformasi')) return 'justice';
  if (t.includes('memanggil') || t.includes('indonesia memanggil')) return 'convergence';
  if (t.includes('tangan tuhan') || t.includes('di dalam tangan')) return 'horizon';
  if (t.includes('mengutus') || t.includes('menerima')) return 'transform';

  // Category-based fallback
  const catMap: Record<string, string> = {
    'Iman & Kepemimpinan': 'convergence',
    'Sejarah & Transformasi': 'justice',
    'Renungan Kebangsaan': 'horizon',
    'Regional Discernment': 'islands',
    'Misi & Gereja': 'transform',
    'Ekonomi & Tata Kelola': 'economic',
  };
  return catMap[category] || 'convergence';
}

/* ── Component ───────────────────────────────────────────────────────── */

export function EditorialCover({ category, title }: { category: string; title?: string }) {
  const motifKey = resolveMotif(category, title);
  const config = motifConfigs[motifKey] || motifConfigs.convergence;
  const W = 480, H = 190;
  const hatch = useId();

  return (
    <svg
      className="editorial-cover"
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      style={{ color: config.fg }}
    >
      <rect width={W} height={H} fill={config.bg} />
      <defs><pattern id={hatch} patternUnits="userSpaceOnUse" width="5" height="5"><path d="m0 5 5-5" stroke="currentColor" opacity=".13" strokeWidth=".65"/></pattern></defs>
      <rect width={W} height={H} fill={`url(#${hatch})`}/>
      {config.render(W, H)}
    </svg>
  );
}
