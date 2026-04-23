import React, { useRef, useEffect, useState } from 'react';

interface EpisodeBadgeProps {
  text: string;
  shape: string;
  bgColor: string;
  textColor: string;
  fontFamily: string;
  size: number; // height in px
}

// ── Helper: generates polygon points for n-pointed stars / bursts ──────────
function starPolygon(
  cx: number, cy: number,
  outerR: number, innerR: number,
  points: number,
): string {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / points - Math.PI / 2;
    pts.push(`${(cx + r * Math.cos(angle)).toFixed(1)},${(cy + r * Math.sin(angle)).toFixed(1)}`);
  }
  return pts.join(' ');
}

// ── Shape definitions ──────────────────────────────────────────────────────
interface ShapeDef {
  vw: number;
  vh: number;
  render: (fill: string) => React.ReactNode;
}

const SHAPE_DEFS: Record<string, ShapeDef> = {
  circle: {
    vw: 200, vh: 200,
    render: (f) => <ellipse cx={100} cy={100} rx={92} ry={92} fill={f} />,
  },
  pill: {
    vw: 300, vh: 140,
    render: (f) => <rect x={8} y={8} width={284} height={124} rx={62} fill={f} />,
  },
  hexagon: {
    vw: 200, vh: 200,
    render: (f) => (
      <polygon points="100,10 177.9,55 177.9,145 100,190 22.1,145 22.1,55" fill={f} />
    ),
  },
  star: {
    vw: 200, vh: 200,
    render: (f) => (
      <polygon points={starPolygon(100, 100, 92, 38, 5)} fill={f} />
    ),
  },
  burst: {
    vw: 200, vh: 200,
    render: (f) => (
      <polygon points={starPolygon(100, 100, 92, 58, 8)} fill={f} />
    ),
  },
  burst12: {
    vw: 200, vh: 200,
    render: (f) => (
      <polygon points={starPolygon(100, 100, 92, 68, 12)} fill={f} />
    ),
  },
  diamond: {
    vw: 200, vh: 200,
    render: (f) => <polygon points="100,8 192,100 100,192 8,100" fill={f} />,
  },
  shield: {
    vw: 200, vh: 230,
    render: (f) => (
      <path
        d="M 100,12 L 188,44 L 188,134 Q 188,192 100,216 Q 12,192 12,134 L 12,44 Z"
        fill={f}
      />
    ),
  },
  octagon: {
    vw: 200, vh: 200,
    render: (f) => (
      <polygon
        points="100,10 163.6,36.4 190,100 163.6,163.6 100,190 36.4,163.6 10,100 36.4,36.4"
        fill={f}
      />
    ),
  },
  ribbon: {
    vw: 300, vh: 110,
    render: (f) => (
      <polygon points="10,55 32,6 268,6 290,55 268,104 32,104" fill={f} />
    ),
  },
  square: {
    vw: 200, vh: 200,
    render: (f) => <rect x={10} y={10} width={180} height={180} rx={28} fill={f} />,
  },
  triangle: {
    vw: 200, vh: 180,
    render: (f) => <polygon points="100,10 192,170 8,170" fill={f} />,
  },
};

// ── Exported shape list for the selector UI ────────────────────────────────
export const EPISODE_SHAPES = [
  { value: 'circle',   label: 'Círculo' },
  { value: 'pill',     label: 'Pastilla' },
  { value: 'hexagon',  label: 'Hexágono' },
  { value: 'star',     label: 'Estrella ★' },
  { value: 'burst',    label: 'Explosión 8' },
  { value: 'burst12',  label: 'Explosión 12' },
  { value: 'diamond',  label: 'Diamante' },
  { value: 'shield',   label: 'Escudo' },
  { value: 'octagon',  label: 'Octágono' },
  { value: 'ribbon',   label: 'Cinta' },
  { value: 'square',   label: 'Cuadrado' },
  { value: 'triangle', label: 'Triángulo' },
];

// ── Mini SVG preview (for the selector grid) ──────────────────────────────
export function ShapePreview({
  shape, color, size = 36,
}: { shape: string; color: string; size?: number }) {
  const def = SHAPE_DEFS[shape] || SHAPE_DEFS.circle;
  return (
    <svg
      viewBox={`0 0 ${def.vw} ${def.vh}`}
      width={size * (def.vw / def.vh)}
      height={size}
    >
      {def.render(color)}
    </svg>
  );
}

// ── Main Badge Component ───────────────────────────────────────────────────
export function EpisodeBadge({
  text, shape, bgColor, textColor, fontFamily, size,
}: EpisodeBadgeProps) {
  const def = SHAPE_DEFS[shape] || SHAPE_DEFS.circle;
  const { vw, vh } = def;
  const textRef = useRef<HTMLSpanElement>(null);
  const [textWidth, setTextWidth] = useState(0);

  const displayH = size;
  const baseWidth = size * (vw / vh);
  const fontSize = size * 0.25;
  const padding = size * 0.15;

  useEffect(() => {
    if (textRef.current) {
      setTextWidth(textRef.current.offsetWidth);
    }
  }, [text, fontSize, fontFamily]);

  const displayW = Math.max(baseWidth, textWidth + padding * 2);

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: `${displayW}px`,
        height: `${displayH}px`,
        filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.5))',
      }}
    >
      {/* Shape SVG */}
      <svg
        viewBox={`0 0 ${vw} ${vh}`}
        width={displayW}
        height={displayH}
        style={{ position: 'absolute', top: 0, left: 0 }}
        aria-hidden="true"
      >
        {def.render(bgColor)}
      </svg>

      {/* Text overlay */}
      <span
        ref={textRef}
        style={{
          position: 'relative',
          fontFamily,
          fontWeight: 900,
          fontSize: `${fontSize}px`,
          color: textColor,
          textTransform: 'uppercase',
          letterSpacing: '0.02em',
          lineHeight: 1,
          whiteSpace: 'nowrap',
          textShadow: '1px 1px 3px rgba(0,0,0,0.15)',
        }}
      >
        {text}
      </span>
    </div>
  );
}
