"use client";

import { useEffect, useId, useRef } from "react";

/**
 * A pokeball, drawn as flat vector. The button colour reads from the
 * CSS variable --pb-btn so scenes can light it up imperatively.
 */
export function Pokeball({
  size = 120,
  className = "",
  style,
}: {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const clip = useId();
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      style={style}
      aria-hidden
      focusable="false"
    >
      <defs>
        <clipPath id={clip}>
          <circle cx="50" cy="50" r="47" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <rect x="0" y="0" width="100" height="50" fill="#ff4a3d" />
        <rect x="0" y="50" width="100" height="50" fill="#e9eef9" />
        <rect x="0" y="45.5" width="100" height="9" fill="#0b0f1c" />
      </g>
      <circle cx="50" cy="50" r="47" fill="none" stroke="#0b0f1c" strokeWidth="5" />
      <circle cx="50" cy="50" r="13.5" fill="#0b0f1c" />
      <circle cx="50" cy="50" r="9" fill="var(--pb-btn, #e9eef9)" />
      <circle cx="50" cy="50" r="4.4" fill="none" stroke="#0b0f1c" strokeWidth="2.2" />
    </svg>
  );
}

/**
 * The fixed companion: a small pokeball that rolls in the corner as
 * the page scrolls, ringed by the reader's progress through the story.
 * Decorative - hidden from assistive tech, gone under reduced motion.
 */
export function ScrollCompanion() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const ballRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<SVGCircleElement | null>(null);

  useEffect(() => {
    let raf = 0;
    let queued = false;
    const C = 2 * Math.PI * 30; // progress ring circumference

    const paint = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      if (wrapRef.current) {
        wrapRef.current.style.opacity = window.scrollY > 240 ? "1" : "0";
      }
      if (ballRef.current) {
        ballRef.current.style.transform = `rotate(${p * 720}deg)`;
      }
      if (ringRef.current) {
        ringRef.current.style.strokeDashoffset = String(C * (1 - p));
      }
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        raf = requestAnimationFrame(paint);
      }
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none fixed bottom-5 right-5 z-40 transition-opacity duration-500"
      style={{ opacity: 0 }}
    >
      <div className="relative h-12 w-12">
        <svg viewBox="0 0 68 68" className="absolute inset-0 h-full w-full -rotate-90">
          <circle cx="34" cy="34" r="30" fill="none" stroke="var(--line)" strokeWidth="2.5" />
          <circle
            ref={ringRef}
            cx="34"
            cy="34"
            r="30"
            fill="none"
            stroke="var(--water)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 30}
            strokeDashoffset={2 * Math.PI * 30}
          />
        </svg>
        <div ref={ballRef} className="absolute inset-[9px]">
          <Pokeball size={30} className="h-full w-full" />
        </div>
      </div>
    </div>
  );
}
