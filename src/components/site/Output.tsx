"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapClient";

/* ==================================================================
   the receipts - the actual `blastoise check` run against a live
   5,000,000-row table, byte for byte. The scroll prints it.
   ================================================================== */

function toneFor(line: string): React.CSSProperties {
  if (/^SHELL REPORT|^={3,}/.test(line)) return { color: "var(--water)", fontWeight: 700 };
  if (/verdict:\s*BLOCK/.test(line)) return { color: "var(--unsafe)", fontWeight: 700 };
  if (/verdict:\s*REQUIRES_APPROVAL/.test(line)) return { color: "var(--timing)", fontWeight: 700 };
  if (/verdict:\s*PROCEED/.test(line)) return { color: "var(--safe)", fontWeight: 700 };
  if (/\bunsafe\b|Hydro Pump/.test(line)) return { color: "var(--unsafe)" };
  if (/\bneeds_timing\b|Rain Check/.test(line)) return { color: "var(--timing)" };
  if (/\bsafe_irreversible\b|One-Way Current/.test(line)) return { color: "var(--irrev)" };
  if (/\bunknown\b|\bFog\b/.test(line)) return { color: "var(--unknown)" };
  if (/\bsafe\b|Calm Water/.test(line)) return { color: "var(--safe)" };
  if (/^\s*\[/.test(line)) return { color: "var(--ink-faint)" };
  return { color: "var(--ink-dim)" };
}

export function Output({ live }: { live: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const lines = live.replace(/\n+$/, "").split("\n");

  useGSAP(
    () => {
              gsap.from("[data-oline]", {
          opacity: 0,
          x: -10,
          stagger: 0.03,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current!.querySelector("[data-term]"),
            start: "top 78%",
            end: "bottom 60%",
            scrub: 0.4,
          },
        });
        gsap.from("[data-ohead]", {
          opacity: 0,
          y: 22,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 74%" },
        });
    },
    { scope: ref },
  );

  return (
    <div id="output" ref={ref} className="hairline">
      <div className="wrap py-40">
        <p data-ohead className="label">
          the receipts
        </p>
        <h2
          data-ohead
          className="mt-3 max-w-2xl font-bold"
          style={{ fontSize: "clamp(1.9rem,4.6vw,3rem)", letterSpacing: "-0.04em" }}
        >
          real output, unaltered
        </h2>
        <p data-ohead className="lede mt-4 max-w-2xl">
          a three-statement migration, assessed against a live database with a seeded
          5,000,000-row events table. exit code 2 - ci stops it. run it yourself with{" "}
          <span className="mono text-[.92em]">--offline</span> and watch two answers
          honestly become <span className="mono text-[.92em]">unknown</span>.
        </p>

        <div data-term className="hairline mt-12 pt-8">
          <p className="mono mb-5 text-xs" style={{ color: "var(--ink-faint)" }}>
            $ blastoise check migrations/0042_add_customer_ref.sql --database-url
            postgres://ro@db/app
          </p>
          <div className="scroll-x">
            <pre className="mono text-[11.5px] leading-[1.75] sm:text-[12.5px]">
              {lines.map((line, i) => (
                <div key={i} data-oline style={{ ...toneFor(line), minWidth: "max-content" }}>
                  {line === "" ? " " : line}
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
