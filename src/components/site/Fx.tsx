"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsapClient";

/* ==================================================================
   the blast radius, literally: circles radiating out from a point,
   forever. Calm and white by default; the story recolours them  - 
   window.__mood is set by scroll triggers ("calm" | "staging" |
   "danger" | "dead" | "verdict:<color>").
   ================================================================== */

declare global {
  interface Window {
    __mood?: string;
  }
}

type RGB = [number, number, number];
const MOODS: Record<string, RGB> = {
  calm: [205, 228, 250],
  staging: [53, 212, 136],
  danger: [255, 75, 64],
  dead: [90, 90, 96],
  water: [86, 200, 245],
};

export function Rings() {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    let W = 0;
    let H = 0;
    let dpr = 1;
    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    window.addEventListener("resize", size);

    const col: RGB = [...MOODS.calm];

    const paint = (t: number) => {
      ctx.clearRect(0, 0, W, H);
      const target = MOODS[window.__mood ?? "calm"] ?? MOODS.calm;
      for (let i = 0; i < 3; i++) col[i] += (target[i] - col[i]) * 0.045;

      const cx = W / 2;
      const cy = H * 0.44;
      const maxR = Math.hypot(Math.max(cx, W - cx), Math.max(cy, H - cy)) * 1.02;
      const SPACING = 120;
      const SPEED = 18; // px/s outward
      const n = Math.ceil(maxR / SPACING) + 1;
      const off = (t * SPEED) % SPACING;

      for (let i = 0; i < n; i++) {
        const r = i * SPACING + off;
        if (r < 8 || r > maxR) continue;
        const fade = 1 - r / maxR;
        /* every third ring rides brighter - the wavefront */
        const lead = i % 3 === 0 ? 1.9 : 1;
        const a = Math.min(0.5, (0.34 * Math.pow(fade, 1.5) + 0.02) * lead);
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${col[0] | 0},${col[1] | 0},${col[2] | 0},${a})`;
        ctx.lineWidth = i % 3 === 0 ? 1.6 : 1;
        ctx.stroke();
      }

      /* the epicentre */
      const pulse = 0.5 + 0.5 * Math.sin(t * 2.2);
      ctx.beginPath();
      ctx.arc(cx, cy, 2.2 + pulse * 1.6, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col[0] | 0},${col[1] | 0},${col[2] | 0},${0.5 + pulse * 0.3})`;
      ctx.fill();
    };

    let raf = 0;
    let visible = true;
    const onVis = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVis);
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (visible) paint(now / 1000);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", size);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="fixed inset-0 -z-10 h-full w-full" />;
}

/* ==================================================================
   the cursor - a dot that is exactly where you are, and a ring that
   is always slightly behind you. Blend-mode difference, grows on
   anything interactive. Gone on touch screens.
   ================================================================== */

export function Cursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    const dx = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power2.out" });
    const dy = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power2.out" });
    const rx = gsap.quickTo(ring, "x", { duration: 0.38, ease: "power3.out" });
    const ry = gsap.quickTo(ring, "y", { duration: 0.38, ease: "power3.out" });

    const move = (e: PointerEvent) => {
      dx(e.clientX);
      dy(e.clientY);
      rx(e.clientX);
      ry(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      ring.dataset.hover = t?.closest("a,button,[data-hover]") ? "1" : "0";
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
    </>
  );
}

/* a link that leans toward the cursor */
export function Magnetic({
  children,
  className,
  href,
}: {
  children: React.ReactNode;
  className?: string;
  href: string;
}) {
  const ref = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.35, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.35, ease: "power3.out" });
    const move = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.28);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
    };
    const leave = () => {
      xTo(0);
      yTo(0);
    };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <a ref={ref} href={href} className={className}>
      {children}
    </a>
  );
}
