import type { SVGProps } from "react";

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function SmileyX(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 60" {...base} {...props}>
      <circle cx="30" cy="28" r="18" />
      <path d="M20 20l7 7M27 20l-7 7" />
      <path d="M33 20l7 7M40 20l-7 7" />
      <path d="M20 36q10 8 20 0" />
      <path d="M30 46q-2 6 0 10M30 46q2 6 0 10" />
    </svg>
  );
}

export function Crown(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 34" {...base} {...props}>
      <path d="M6 30 10 10l10 12 10-16 10 16 10-12 4 20z" />
      <path d="M6 30h44" />
    </svg>
  );
}

export function Lightning(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 60" {...base} {...props}>
      <path d="M24 4 8 34h12L14 56l20-30H22z" />
    </svg>
  );
}

export function Dollar(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 60" {...base} {...props}>
      <path d="M20 4v52" />
      <path d="M29 14c0-6-6-8-11-8-6 0-11 4-11 9s5 7 11 9c7 2 12 4 12 10s-6 9-12 9c-6 0-11-3-11-9" />
    </svg>
  );
}

export function MusicNote(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 60" {...base} {...props}>
      <path d="M24 42V12l24-6v28" />
      <circle cx="17" cy="42" r="7" />
      <circle cx="41" cy="34" r="7" />
    </svg>
  );
}

export function Leaf(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 60" {...base} {...props}>
      <path d="M30 6c4 10 4 18 0 26 -4-8-4-16 0-26z" />
      <path d="M30 32c10-2 17-8 21-16-10 0-18 4-21 10 M30 32c-10-2-17-8-21-16 10 0 18 4 21 10" />
      <path d="M30 32c8 2 13 8 15 16-9-1-15-6-17-12 M30 32c-8 2-13 8-15 16 9-1 15-6 17-12" />
      <path d="M30 32v22" />
    </svg>
  );
}

export function Bee(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 60 44" {...base} {...props}>
      <path d="M18 4 24 12M42 4l-6 8" />
      <ellipse cx="30" cy="24" rx="12" ry="9" />
      <path d="M20 20h20M18 24h24M20 28h20" />
      <path d="M8 18C2 16 2 26 10 24 M52 18c6-2 6 8-2 6" />
    </svg>
  );
}

export function Lighter(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 60" {...base} {...props}>
      <path d="M14 4c2 4-2 6 0 10h12c2-4-2-6 0-10" />
      <rect x="10" y="14" width="20" height="38" rx="4" />
      <path d="M14 24h12M14 32h12M14 40h12" />
    </svg>
  );
}

export function ShotGlass(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 50" {...base} {...props}>
      <path d="M8 6h24l-5 38H13z" />
      <path d="M6 40h28" />
      <path d="M14 0l1 4M20-2v5M26 0l-1 4" />
    </svg>
  );
}

export function XMark({ filled, ...props }: SVGProps<SVGSVGElement> & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" {...props}>
      <path
        d="M3 3l14 14M17 3L3 17"
        fill="none"
        stroke="currentColor"
        strokeWidth={filled ? 3 : 2}
        strokeLinecap="round"
        opacity={filled ? 1 : 0.3}
      />
    </svg>
  );
}

export function Squiggle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 200 12" preserveAspectRatio="none" {...props}>
      <path
        d="M2 6c8-6 16 6 24 0s16-6 24 0 16 6 24 0 16-6 24 0 16 6 24 0 16-6 24 0 16 6 24 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
