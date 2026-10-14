"use client";

import { useId, useMemo } from "react";
import type { ArtSpec, GarmentKind } from "@/lib/api/types";
import { cn } from "@/lib/utils";

/**
 * Generated stand-in for product photography: narrow handwoven strips sewn side by side,
 * clipped to the garment's silhouette. Deterministic per seed so a product always looks the same.
 */

const W = 400;
const H = 500;

function rng(seed: number) {
  let a = seed || 1;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function isLight(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 180;
}

const SILHOUETTES: Record<GarmentKind, string> = {
  smock:
    "M168 92 Q200 112 232 92 L298 112 Q322 150 344 214 L292 232 L300 300 Q312 380 322 432 Q200 448 78 432 Q88 380 100 300 L108 232 L56 214 Q78 150 102 112 Z",
  kids:
    "M178 150 Q200 164 222 150 L270 164 Q288 192 304 238 L266 250 L272 300 Q280 356 288 392 Q200 404 112 392 Q120 356 128 300 L134 250 L96 238 Q112 192 130 164 Z",
  dress:
    "M162 84 Q200 104 238 84 L256 92 Q262 150 248 222 Q300 330 320 446 Q200 462 80 446 Q100 330 152 222 Q138 150 144 92 Z",
  top: "M166 128 Q200 148 234 128 L292 146 Q318 180 336 236 L292 252 L290 352 Q200 364 110 352 L108 252 L64 236 Q82 180 108 146 Z",
  set: "M170 86 Q200 102 230 86 L282 100 Q304 130 318 176 L282 188 L280 250 Q200 260 120 250 L118 188 L82 176 Q96 130 118 100 Z M128 272 L272 272 Q294 360 306 446 Q200 458 94 446 Q106 360 128 272 Z",
  cap: "M92 300 Q92 180 200 172 Q308 180 308 300 Q308 322 296 330 Q200 344 104 330 Q92 322 92 300 Z",
  bag: "M104 206 L296 206 L310 420 Q200 432 90 420 Z",
};

const NECKS: Partial<Record<GarmentKind, { front: string; back: string }>> = {
  smock: { front: "M168 92 Q200 112 232 92 L214 150 Q200 160 186 150 Z", back: "M172 93 Q200 108 228 93 Q200 116 172 93 Z" },
  kids: { front: "M178 150 Q200 164 222 150 L210 186 Q200 192 190 186 Z", back: "M180 151 Q200 162 220 151 Q200 168 180 151 Z" },
  top: { front: "M166 128 Q200 148 234 128 Q200 170 166 128 Z", back: "M168 129 Q200 144 232 129 Q200 150 168 129 Z" },
  dress: { front: "M162 84 Q200 104 238 84 Q200 150 162 84 Z", back: "M164 85 Q200 100 236 85 Q200 112 164 85 Z" },
  set: { front: "M170 86 Q200 102 230 86 Q200 128 170 86 Z", back: "M172 87 Q200 98 228 87 Q200 106 172 87 Z" },
};

const POCKETS: Partial<Record<GarmentKind, string>> = {
  smock: "M226 268 L272 268 L270 322 L228 322 Z",
  kids: "M214 288 L246 288 L245 324 L215 324 Z",
};

type Strip = { x: number; w: number; base: string; lines: { x: number; w: number; c: string }[] };

function buildStrips(palette: string[], seed: number, stripWidth: number, from: number, to: number): Strip[] {
  const rand = rng(seed);
  const [base, ...accents] = palette;
  const variants = Array.from({ length: 3 }, () => {
    const count = 1 + Math.floor(rand() * 3);
    return Array.from({ length: count }, () => ({
      at: 0.15 + rand() * 0.7,
      w: 0.04 + rand() * 0.1,
      c: accents[Math.floor(rand() * accents.length)] ?? base,
    }));
  });
  const strips: Strip[] = [];
  for (let x = from, i = 0; x < to; x += stripWidth, i++) {
    // Most strips repeat the main stripe; every few strips break rhythm, like real strip-cloth.
    const v = i % 4 === 3 ? variants[1 + (i % 2)] : variants[0];
    strips.push({
      x,
      w: stripWidth,
      base: i % 7 === 5 && accents[0] ? accents[0] : base,
      lines: v.map((l) => ({ x: x + l.at * stripWidth, w: Math.max(1, l.w * stripWidth), c: l.c })),
    });
  }
  return strips;
}

export function ProductArt({
  spec,
  className,
  title,
}: {
  spec: ArtSpec;
  className?: string;
  title?: string;
}) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const view = spec.view ?? "front";
  const backdrop = spec.backdrop ?? "#ece4d6";
  const lace = isLight(spec.palette[0]);

  const strips = useMemo(() => {
    if (view === "detail") return buildStrips(spec.palette, spec.seed, 74, -10, W + 10);
    const width = spec.kind === "cap" || spec.kind === "kids" ? 16 : spec.kind === "bag" ? 22 : 19;
    return buildStrips(spec.palette, spec.seed, width, 40, 360);
  }, [spec.palette, spec.seed, spec.kind, view]);

  const ids = { clip: `c${uid}`, shade: `s${uid}`, weft: `w${uid}`, lace: `l${uid}`, vignette: `v${uid}` };
  const seamColour = isLight(spec.palette[0]) ? "rgba(60,40,20,0.22)" : "rgba(0,0,0,0.28)";
  const neck = NECKS[spec.kind]?.[view === "back" ? "back" : "front"];
  const pocket = view === "front" ? POCKETS[spec.kind] : undefined;
  const silhouette = SILHOUETTES[spec.kind];

  const fabric = (
    <>
      {strips.map((s) => (
        <g key={s.x}>
          <rect x={s.x} y={0} width={s.w + 0.5} height={H} fill={s.base} />
          {s.lines.map((l, i) => (
            <rect key={i} x={l.x} y={0} width={l.w} height={H} fill={l.c} />
          ))}
          <rect x={s.x} y={0} width={view === "detail" ? 2 : 1} height={H} fill={seamColour} />
        </g>
      ))}
      <rect width={W} height={H} fill={`url(#${ids.weft})`} />
      {lace && <rect width={W} height={H} fill={`url(#${ids.lace})`} />}
    </>
  );

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className={cn("block h-full w-full", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern id={ids.weft} width="6" height={view === "detail" ? 5 : 3} patternUnits="userSpaceOnUse">
          <rect width="6" height="1" fill="rgba(255,255,255,0.07)" />
          <rect y={view === "detail" ? 2.5 : 1.5} width="6" height="0.6" fill="rgba(0,0,0,0.08)" />
        </pattern>
        <pattern id={ids.lace} width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="9" cy="9" r="4.2" fill="none" stroke="rgba(120,90,50,0.28)" strokeWidth="0.9" />
          <circle cx="0" cy="0" r="2" fill="rgba(120,90,50,0.18)" />
          <circle cx="18" cy="18" r="2" fill="rgba(120,90,50,0.18)" />
        </pattern>
        <linearGradient id={ids.shade} x1="0" x2="1" y1="0" y2="0.3">
          <stop offset="0" stopColor="#fff" stopOpacity="0.16" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </linearGradient>
        <radialGradient id={ids.vignette} cx="0.5" cy="0.42" r="0.75">
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.1" />
        </radialGradient>
        {silhouette && view !== "detail" && (
          <clipPath id={ids.clip}>
            <path d={silhouette} />
          </clipPath>
        )}
      </defs>

      {view === "detail" ? (
        <g transform={`rotate(${(spec.seed % 5) - 2} 200 250) scale(1.08) translate(-16 -20)`}>
          {fabric}
          {/* hand stitches along one seam */}
          <line
            x1={strips[2]?.x ?? 140}
            x2={strips[2]?.x ?? 140}
            y1="-20"
            y2="540"
            stroke={spec.palette[spec.palette.length - 1]}
            strokeWidth="2"
            strokeDasharray="7 9"
            opacity="0.55"
          />
        </g>
      ) : (
        <>
          <rect width={W} height={H} fill={backdrop} />
          <ellipse cx="200" cy={spec.kind === "cap" ? 352 : spec.kind === "top" ? 380 : 462} rx="150" ry="12" fill="rgba(40,30,20,0.12)" />
          <g clipPath={`url(#${ids.clip})`}>
            {fabric}
            <rect width={W} height={H} fill={`url(#${ids.shade})`} />
          </g>
          {neck && <path d={neck} fill={backdrop} />}
          {neck && view === "front" && (
            <path d={neck} fill="none" stroke={spec.palette[3] ?? spec.palette[1]} strokeWidth="2.5" strokeDasharray="3 3" opacity="0.8" />
          )}
          {pocket && (
            <>
              <path d={pocket} fill="rgba(0,0,0,0.12)" />
              <path d={pocket} fill="none" stroke={spec.palette[1]} strokeWidth="1.4" strokeDasharray="2 3" opacity="0.7" />
            </>
          )}
          {spec.kind === "bag" && (
            <path d="M150 210 Q150 130 200 130 Q250 130 250 210" fill="none" stroke="#5a3d1e" strokeWidth="9" strokeLinecap="round" />
          )}
          {spec.kind === "cap" && <path d="M98 316 Q200 334 302 316" fill="none" stroke="rgba(0,0,0,0.25)" strokeWidth="3" />}
          <path d={silhouette} fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
        </>
      )}
      <rect width={W} height={H} fill={`url(#${ids.vignette})`} />
    </svg>
  );
}
