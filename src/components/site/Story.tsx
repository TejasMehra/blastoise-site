"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP } from "@/lib/gsapClient";

/* ==================================================================
   the story of one migration, in five pinned acts. Each act holds
   the screen while the scroll plays it: the line types itself, the
   staging number counts, the outage clock burns through all
   fifty-six seconds, and the verdict lands before the merge.

   Every number is a real measurement from the blastoise repo.
   ================================================================== */

const SQL =
  "ALTER TABLE events ADD COLUMN customer_ref uuid NOT NULL DEFAULT gen_random_uuid();";

function setMood(m: string) {
  window.__mood = m;
}

/* shared: pin an act and hand its timeline to a builder */
function usePinned(
  ref: React.RefObject<HTMLElement | null>,
  length: string,
  build: (tl: gsap.core.Timeline) => void,
  onToggle?: (active: boolean) => void,
) {
  useGSAP(
    () => {
              const tl = gsap.timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: length,
            pin: true,
            scrub: 0.55,
            onToggle: (self) => onToggle?.(self.isActive),
          },
        });
        build(tl);
    },
    { scope: ref },
  );
}

export function Story() {
  return (
    <section id="story" aria-label="the story of one migration">
      <ActOne />
      <ActTwo />
      <ActThree />
      <ActFour />
      <ActFive />
    </section>
  );
}

/* ------------------------------------------------------------------
   act i - the line
   ------------------------------------------------------------------ */

function ActOne() {
  const ref = useRef<HTMLDivElement | null>(null);

  usePinned(ref, "+=220%", (tl) => {
    const code = ref.current!.querySelector<HTMLElement>("[data-code]")!;
    const proxy = { n: 0 };
    tl.to(proxy, {
      n: SQL.length,
      duration: 5,
      ease: "none",
      snap: { n: 1 },
      onUpdate: () => {
        code.textContent = SQL.slice(0, proxy.n);
      },
    });
    tl.from("[data-fact]", { opacity: 0, y: 22, stagger: 0.9, duration: 1.4, ease: "power2.out" }, "-=1");
    tl.to({}, { duration: 1 });
  });

  return (
    <div ref={ref} className="flex min-h-screen items-center">
      <div className="wrap">
        <p className="label">act i - friday, 4:52 pm</p>
        <p
          className="mono sql-fluid mt-8 leading-relaxed"
          style={{
            fontSize: "clamp(1.15rem, 2.9vw, 1.9rem)",
            color: "var(--ink)",
            minHeight: "3em",
          }}
        >
          <code data-code />
          <span className="caret" style={{ color: "var(--water)" }}>
            ▍
          </span>
        </p>
        <div className="mt-12 flex flex-col gap-3">
          <p data-fact className="lede">
            reviewed and approved in nine minutes - <em>&ldquo;simple column add, lgtm.&rdquo;</em>
          </p>
          <p data-fact className="mono text-sm" style={{ color: "var(--safe)" }}>
            ✓ lint&ensp;✓ tests&ensp;✓ build&ensp;✓ sql-linter
          </p>
          <p data-fact className="lede">
            every linter that reads sql said nothing.{" "}
            <span style={{ color: "var(--ink-faint)" }}>
              because in the sql, there is nothing to see.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   act ii - staging
   ------------------------------------------------------------------ */

function ActTwo() {
  const ref = useRef<HTMLDivElement | null>(null);

  usePinned(
    ref,
    "+=170%",
    (tl) => {
      const num = ref.current!.querySelector<HTMLElement>("[data-ms]")!;
      const proxy = { v: 0 };
      tl.to(proxy, {
        v: 82.331,
        duration: 3.4,
        ease: "power1.inOut",
        onUpdate: () => {
          num.textContent = proxy.v.toFixed(3);
        },
      });
      tl.from("[data-after]", { opacity: 0, y: 18, stagger: 0.8, duration: 1.3 }, "-=0.6");
      tl.to({}, { duration: 0.8 });
    },
    (active) => setMood(active ? "staging" : "calm"),
  );

  return (
    <div ref={ref} className="flex min-h-screen items-center">
      <div className="wrap text-center">
        <p className="label">act ii - staging · 1,000 rows</p>
        <p
          className="mono mt-6 font-bold tabular-nums"
          style={{
            fontSize: "clamp(4rem, 15vw, 10.5rem)",
            letterSpacing: "-0.05em",
            lineHeight: 1,
            color: "var(--safe)",
          }}
        >
          <span data-ms>0.000</span>
          <span style={{ fontSize: ".3em", marginLeft: ".1em" }}>ms</span>
        </p>
        <p data-after className="lede mx-auto mt-8 max-w-md">
          green across the board. &ldquo;ship it.&rdquo;
        </p>
        <p data-after className="mono mt-3 text-sm" style={{ color: "var(--ink-faint)" }}>
          staging isn&rsquo;t lying - it just isn&rsquo;t production.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   act iii - production. the reader holds the lock.
   ------------------------------------------------------------------ */

const CASCADE = [
  "connection pool exhausted",
  "health checks failing",
  "pagers firing",
];

function ActThree() {
  const ref = useRef<HTMLDivElement | null>(null);

  usePinned(
    ref,
    "+=340%",
    (tl) => {
      const root = ref.current!;
      const clock = root.querySelector<HTMLElement>("[data-clock]")!;
      const queued = root.querySelector<HTMLElement>("[data-queued]")!;
      const proxy = { s: 0 };

      tl.from("[data-intro]", { opacity: 0, y: 20, stagger: 0.5, duration: 1 });
      tl.to(proxy, {
        s: 56,
        duration: 9,
        ease: "none",
        onUpdate: () => {
          clock.textContent = `0:${proxy.s < 10 ? "0" : ""}${proxy.s.toFixed(1)}`;
          queued.textContent = Math.round(proxy.s * 90).toLocaleString();
        },
      });
      root.querySelectorAll<HTMLElement>("[data-cascade]").forEach((el, i) => {
        tl.to(el, { opacity: 1, duration: 0.5 }, 2.6 + i * 2.1);
      });
      tl.to({}, { duration: 1 });
    },
    (active) => setMood(active ? "danger" : "staging"),
  );

  return (
    <div ref={ref} className="flex min-h-screen items-center">
      <div className="wrap text-center">
        <p className="label" data-intro style={{ color: "var(--unsafe)" }}>
          act iii - production · 5,000,000 rows
        </p>
        <p data-intro className="mono mt-4 text-sm font-bold" style={{ color: "var(--unsafe)" }}>
          same line. ACCESS EXCLUSIVE - reads ✕ · writes ✕
        </p>
        <p
          className="mono mt-6 font-bold tabular-nums"
          style={{
            fontSize: "clamp(4.6rem, 18vw, 12.5rem)",
            letterSpacing: "-0.05em",
            lineHeight: 1,
            color: "var(--unsafe)",
          }}
        >
          <span data-clock>0:00.0</span>
        </p>
        <p className="mono mt-6 text-sm" style={{ color: "var(--ink-dim)" }}>
          <span data-queued className="font-bold" style={{ color: "var(--unsafe)" }}>
            0
          </span>{" "}
          queries queued behind the lock - you&rsquo;re holding it. keep scrolling.
        </p>
        <div className="mx-auto mt-9 flex max-w-xs flex-col gap-2 text-left">
          {CASCADE.map((c) => (
            <p
              key={c}
              data-cascade
              className="mono text-sm"
              style={{ color: "var(--ink-dim)", opacity: 0.16 }}
            >
              <span style={{ color: "var(--unsafe)" }}>▸</span> {c}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   act iv - the silence
   ------------------------------------------------------------------ */

function ActFour() {
  const ref = useRef<HTMLDivElement | null>(null);

  usePinned(
    ref,
    "+=160%",
    (tl) => {
      tl.from("[data-s]", { opacity: 0, y: 24, stagger: 1.1, duration: 1.6, ease: "power2.out" });
      tl.to({}, { duration: 1 });
    },
    (active) => setMood(active ? "dead" : "danger"),
  );

  return (
    <div ref={ref} className="flex min-h-screen items-center">
      <div className="wrap max-w-3xl text-center">
        <p
          data-s
          className="font-semibold"
          style={{
            fontSize: "clamp(1.8rem, 5vw, 3.2rem)",
            letterSpacing: "-0.035em",
            color: "var(--ink)",
          }}
        >
          fifty-six seconds of silence.
        </p>
        <p data-s className="lede mt-6">
          every read, every write, queued behind one column default.
        </p>
        <p data-s className="lede mt-2" style={{ color: "var(--ink-faint)" }}>
          nothing in the diff warned anyone.
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   act v - the other timeline
   ------------------------------------------------------------------ */

const OUT = [
  { t: "$ blastoise check migrations/0042_add_customer_ref.sql", c: "var(--ink)" },
  { t: "L1  create_index_concurrently   safe          seconds     proven", c: "var(--safe)" },
  { t: "L3  alter_table                 needs_timing  sub_second  observed", c: "var(--timing)" },
  { t: "L5  alter_table                 unsafe        minutes     simulated", c: "var(--unsafe)" },
  { t: "    add_column_default_volatile blocks reads and writes for a hold", c: "var(--ink-dim)" },
  { t: "    measured in minutes at worst: an outage-length stall", c: "var(--ink-dim)" },
  { t: "verdict: BLOCK · exit 2", c: "var(--unsafe)", bold: true },
];

function ActFive() {
  const ref = useRef<HTMLDivElement | null>(null);

  usePinned(
    ref,
    "+=260%",
    (tl) => {
      tl.from("[data-head]", { opacity: 0, y: 20, stagger: 0.5, duration: 1 });
      tl.from("[data-sprite]", { opacity: 0, scale: 0.4, duration: 1.2, ease: "back.out(2)" }, "-=0.4");
      tl.from("[data-line]", { opacity: 0, x: -14, stagger: 0.55, duration: 0.5 }, "-=0.3");
      tl.from("[data-coda]", { opacity: 0, y: 18, stagger: 0.7, duration: 1.2 });
      tl.to({}, { duration: 1 });
    },
    (active) => setMood(active ? "water" : "dead"),
  );

  return (
    <div ref={ref} className="flex min-h-screen items-center">
      <div className="wrap max-w-3xl">
        <p data-head className="label" style={{ color: "var(--water)" }}>
          act v - the timeline where you installed blastoise
        </p>
        <div className="mt-6 flex items-center gap-4" data-head>
          <Image
            data-sprite
            src="/assets/blastoise.png"
            alt=""
            width={56}
            height={56}
            unoptimized
            style={{ imageRendering: "pixelated" }}
          />
          <p className="lede">
            the check ran <strong style={{ color: "var(--ink)" }}>before the merge</strong> - and it
            read the live table, not just the diff.
          </p>
        </div>

        <div className="hairline mt-8 pt-6">
          <pre className="scroll-x mono text-[12px] leading-[1.9] sm:text-[13px]">
            {OUT.map((l) => (
              <div
                key={l.t}
                data-line
                style={{ color: l.c, fontWeight: l.bold ? 700 : 400, minWidth: "max-content" }}
              >
                {l.t}
              </div>
            ))}
          </pre>
        </div>

        <div className="hairline mt-6 pt-6">
          <p data-coda className="lede">
            five million rows. volatile default. full table rewrite under the strongest
            lock postgres has.
          </p>
          <p data-coda className="mt-3 font-semibold" style={{ fontSize: "clamp(1.2rem,2.6vw,1.6rem)", color: "var(--ink)" }}>
            the merge never happened. the outage stays fictional.
          </p>
        </div>
      </div>
    </div>
  );
}
