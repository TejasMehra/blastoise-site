"use client";

import { useRef, useState } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsapClient";
import { Magnetic } from "./Fx";
import { REPO_URL } from "@/lib/site";

/* ================================================================== */
/* hero - the name of the game, letter by letter                       */
/* ================================================================== */

export function Hero() {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
              const split = new SplitText("[data-title]", { type: "chars,lines", mask: "lines" });
        gsap.from(split.chars, {
          yPercent: 110,
          stagger: 0.022,
          duration: 0.9,
          ease: "power4.out",
          delay: 0.15,
        });
        gsap.from("[data-rise]", {
          opacity: 0,
          y: 18,
          stagger: 0.12,
          duration: 0.9,
          ease: "power3.out",
          delay: 0.75,
        });
        /* leave: the hero sinks as the story takes over */
        gsap.to(ref.current, {
          opacity: 0,
          y: -90,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "bottom 38%",
            scrub: true,
          },
        });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="wrap">
        <p data-rise className="label">
          postgres migration safety - it reads your live database
        </p>
        <h1
          data-title
          className="mx-auto mt-6 max-w-4xl font-bold"
          style={{
            fontSize: "clamp(2.6rem, 7.4vw, 5.4rem)",
            letterSpacing: "-0.045em",
            lineHeight: 1.02,
          }}
        >
          know the blast radius before you migrate.
        </h1>
        <p data-rise className="lede mx-auto mt-8 max-w-xl">
          the same <span className="mono text-[.92em]">ALTER TABLE</span> is harmless on a
          thousand rows and an outage on five million - and the diff looks identical.
        </p>
        <div data-rise className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Magnetic href={REPO_URL} className="pill">
            github
          </Magnetic>
          <Magnetic href="/docs" className="pill pill-ghost">
            docs
          </Magnetic>
        </div>
      </div>
      <p
        data-rise
        className="label absolute bottom-8 left-0 right-0 text-center"
        aria-hidden
      >
        scroll
      </p>
    </div>
  );
}

/* ================================================================== */
/* manifesto - the thesis, lit word by word as you pass through it    */
/* ================================================================== */

export function Manifesto() {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
              const split = new SplitText("[data-m]", { type: "words" });
        gsap.from(split.words, {
          opacity: 0.13,
          stagger: 0.06,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 82%",
            end: "bottom 45%",
            scrub: true,
          },
        });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="wrap py-40 sm:py-56">
      <p
        data-m
        className="max-w-3xl font-semibold"
        style={{
          fontSize: "clamp(1.5rem, 3.6vw, 2.5rem)",
          letterSpacing: "-0.03em",
          lineHeight: 1.35,
          color: "var(--ink)",
        }}
      >
        every migration linter reads the sql and stops. but the danger was never in
        the sql - it lives in the table: the row count, the lock, the rewrite. only
        something that reads the database can see what a migration will actually do.
      </p>
    </div>
  );
}

/* ================================================================== */
/* verdicts - five, full detail, swept horizontally by the scroll     */
/* ================================================================== */

interface Verdict {
  no: string;
  value: string;
  name: string;
  tone: string;
  action: string;
  detail: string;
  exit: string;
}

const VERDICTS: Verdict[] = [
  {
    no: "01",
    value: "safe",
    name: "calm water",
    tone: "var(--safe)",
    action: "do nothing. merge it.",
    detail:
      "the lock this statement takes blocks nothing that already exists - or holds briefly enough to sit under every threshold.",
    exit: "exit 0 · proceed",
  },
  {
    no: "02",
    value: "safe_irreversible",
    name: "one-way current",
    tone: "var(--irrev)",
    action: "merge it - and write down that there is no undo.",
    detail:
      "safe to run, but the committed effect cannot be reversed by a migration. irreversibility never makes a statement unsafe; it only picks this tier over calm water.",
    exit: "exit 0 · proceed",
  },
  {
    no: "03",
    value: "needs_timing",
    name: "rain check",
    tone: "var(--timing)",
    action: "run it off-peak, behind lock_timeout with retries.",
    detail:
      "safe in itself, disruptive at the wrong moment. any ACCESS EXCLUSIVE on a live table lands here at minimum - the queue behind the lock doesn't shrink because the hold is brief.",
    exit: "exit 1 · requires_approval",
  },
  {
    no: "04",
    value: "unsafe",
    name: "hydro pump",
    tone: "var(--unsafe)",
    action: "do not run as written. there is a safe rewrite.",
    detail:
      "blocks reads or writes long enough to be an outage on this table. usually: CONCURRENTLY, NOT VALID then VALIDATE, or a nullable column plus a backfill.",
    exit: "exit 2 · block",
  },
  {
    no: "05",
    value: "unknown",
    name: "fog",
    tone: "var(--unknown)",
    action: "blastoise refuses to guess. a human looks.",
    detail:
      "not enough evidence - no snapshot, or an estimate straddling a threshold by less than the constant's known spread. a refused verdict costs thirty seconds; a false block costs trust.",
    exit: "exit 1 · requires_approval",
  },
];

export function Verdicts() {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
              const row = ref.current!.querySelector<HTMLElement>("[data-row]")!;
        const shift = () => -(row.scrollWidth - window.innerWidth + 48);
        gsap.to(row, {
          x: shift,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top top",
            end: "+=280%",
            pin: true,
            anticipatePin: 1,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
    },
    { scope: ref },
  );

  return (
    <div id="verdicts" ref={ref} className="overflow-hidden">
      <div className="flex min-h-screen flex-col justify-center py-16">
        <div className="wrap mb-14">
          <p className="label">the pokédex</p>
          <h2
            className="mt-3 font-bold"
            style={{ fontSize: "clamp(1.9rem,4.6vw,3rem)", letterSpacing: "-0.04em" }}
          >
            every statement gets a verdict
          </h2>
          <p className="lede mt-4 max-w-xl">
            ordered by what the reviewer has to do - not by how alarming the statement
            sounds. a file takes its worst statement&rsquo;s verdict.
          </p>
        </div>

        <div
          data-row
          className="flex gap-20 pl-6 pr-24 sm:pl-[max(1.5rem,calc(50vw-510px))]"
        >
          {VERDICTS.map((v) => (
            <article key={v.value} className="w-[21rem] shrink-0 sm:w-[24rem]">
              <p
                className="mono text-sm"
                style={{ color: v.tone }}
              >
                {v.no}
              </p>
              <h3
                className="mt-3 font-bold"
                style={{
                  fontSize: "clamp(2.2rem, 5vw, 3.3rem)",
                  letterSpacing: "-0.04em",
                  lineHeight: 1,
                  color: v.tone,
                }}
              >
                {v.name}
              </h3>
              <p className="mono mt-2 text-xs" style={{ color: "var(--ink-faint)" }}>
                {v.value} · {v.exit}
              </p>
              <p className="mt-6 text-[15px] font-medium" style={{ color: "var(--ink)" }}>
                {v.action}
              </p>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--ink-dim)" }}>
                {v.detail}
              </p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* the sixteen - one statement × four tables, measured               */
/* ================================================================== */

const SIZES = ["1k", "100k", "1m", "10m"];
const MATRIX: { sql: string; lock: string; tone: string; cells: string[] }[] = [
  {
    sql: "CREATE INDEX …",
    lock: "SHARE · blocks writes",
    tone: "var(--timing)",
    cells: ["6ms", "251ms", "1.11s", "18.4s"],
  },
  {
    sql: "CREATE INDEX CONCURRENTLY …",
    lock: "SHARE UPDATE EXCLUSIVE · blocks nothing",
    tone: "var(--safe)",
    cells: ["0", "0", "0", "0"],
  },
  {
    sql: "ADD COLUMN … DEFAULT 'free'",
    lock: "ACCESS EXCLUSIVE · blocks reads + writes",
    tone: "var(--timing)",
    cells: ["18ms", "5ms", "9ms", "6ms"],
  },
  {
    sql: "ADD COLUMN … DEFAULT gen_random_uuid()",
    lock: "ACCESS EXCLUSIVE · blocks reads + writes",
    tone: "var(--unsafe)",
    cells: ["82ms", "4.3s", "25.9s", "4m 59s"],
  },
];

export function Sixteen() {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
              gsap.from("[data-mrow]", {
          opacity: 0,
          y: 26,
          stagger: 0.14,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 74%" },
        });
        gsap.from("[data-cell]", {
          opacity: 0,
          stagger: 0.05,
          duration: 0.5,
          scrollTrigger: { trigger: ref.current, start: "top 64%" },
        });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="wrap py-40">
      <p className="label">the sixteen</p>
      <h2
        className="mt-3 max-w-2xl font-bold"
        style={{ fontSize: "clamp(1.9rem,4.6vw,3rem)", letterSpacing: "-0.04em" }}
      >
        one statement, four tables. read the rows across.
      </h2>
      <p className="lede mt-4 max-w-xl">
        blocked traffic, measured on postgresql 17.10 - the harness and its results are
        committed in the repo.
      </p>

      <div className="scroll-x mt-14">
        <table className="w-full min-w-[40rem] border-collapse text-left">
          <thead>
            <tr>
              <th className="label pb-4 pr-6 font-normal">statement</th>
              {SIZES.map((s) => (
                <th key={s} className="label pb-4 pr-6 text-right font-normal">
                  {s} rows
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MATRIX.map((r) => (
              <tr key={r.sql} data-mrow className="hairline">
                <th scope="row" className="py-5 pr-6 font-normal">
                  <span className="mono block text-[13px]" style={{ color: "var(--ink)" }}>
                    {r.sql}
                  </span>
                  <span className="mono mt-1 block text-[11px]" style={{ color: "var(--ink-faint)" }}>
                    {r.lock}
                  </span>
                </th>
                {r.cells.map((c, i) => (
                  <td key={i} className="py-5 pr-6 text-right align-middle">
                    <span
                      data-cell
                      className="mono text-[15px] font-bold tabular-nums"
                      style={{ color: c === "0" ? "var(--ink-faint)" : r.tone }}
                    >
                      {c === "0" ? " - " : c}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mono mt-8 max-w-2xl text-xs leading-relaxed" style={{ color: "var(--ink-faint)" }}>
        CONCURRENTLY takes longer to build - and nothing waits on it, at any size. the
        volatile default is the same statement at every size; only the table changed.
      </p>
    </div>
  );
}

/* ================================================================== */
/* the field data - counters                                          */
/* ================================================================== */

export function FieldData() {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
              ref.current!.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
          const target = Number(el.dataset.count);
          const proxy = { v: 0 };
          gsap.to(proxy, {
            v: target,
            duration: 2.2,
            ease: "power3.out",
            snap: { v: 1 },
            onUpdate: () => {
              el.textContent = proxy.v.toLocaleString();
            },
            scrollTrigger: { trigger: el, start: "top 80%" },
          });
        });
        gsap.from("[data-fd]", {
          opacity: 0,
          y: 24,
          stagger: 0.16,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 72%" },
        });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="hairline">
      <div className="wrap py-40">
        <p data-fd className="label">
          the field data - 3,081 real migrations from coder, sourcegraph, mattermost, cal.com…
        </p>
        <div className="mt-14 grid gap-14 sm:grid-cols-2">
          <div data-fd>
            <p
              className="mono font-bold tabular-nums"
              style={{
                fontSize: "clamp(4rem, 11vw, 7.5rem)",
                letterSpacing: "-0.05em",
                lineHeight: 1,
                color: "var(--unsafe)",
              }}
            >
              <span data-count="1875">1,875</span>
            </p>
            <p className="mono mt-4 text-sm" style={{ color: "var(--ink)" }}>
              plain CREATE INDEX
            </p>
            <p className="mono mt-1 text-xs" style={{ color: "var(--ink-faint)" }}>
              every write on the table queues until the build finishes
            </p>
          </div>
          <div data-fd>
            <p
              className="mono font-bold tabular-nums"
              style={{
                fontSize: "clamp(4rem, 11vw, 7.5rem)",
                letterSpacing: "-0.05em",
                lineHeight: 1,
                color: "var(--safe)",
              }}
            >
              <span data-count="121">121</span>
            </p>
            <p className="mono mt-4 text-sm" style={{ color: "var(--ink)" }}>
              CREATE INDEX CONCURRENTLY
            </p>
            <p className="mono mt-1 text-xs" style={{ color: "var(--ink-faint)" }}>
              blocks nothing, at any table size
            </p>
          </div>
        </div>
        <p data-fd className="lede mt-16 max-w-2xl">
          good engineers ship the write-blocking form{" "}
          <strong style={{ color: "var(--ink)" }}>94% of the time</strong> - not because
          they don&rsquo;t know the rule, but because at review time nobody knows how big
          the table is.
        </p>
      </div>
    </div>
  );
}

/* ================================================================== */
/* how it knows                                                       */
/* ================================================================== */

const LAYERS = [
  {
    k: "torrent",
    tone: "var(--water)",
    text: "the real postgres parser - libpg_query, not regex. every statement classified by the exact form that changes its lock: a volatile default is not a constant one, CONCURRENTLY is not plain CREATE INDEX.",
  },
  {
    k: "shell armour",
    tone: "var(--irrev)",
    text: "a lock catalog mapping every ddl form to the lock it takes and what that blocks - each row cited against the postgres docs and source, validated at load time.",
  },
  {
    k: "hydro scan",
    tone: "var(--safe)",
    text: "live introspection: row counts with staleness, current lock holders, invalid indexes, replica lag, and a calibration probe that scales every estimate to your hardware. a three-GRANT read-only role; refuses roles that could write; never reads a row of your data.",
  },
  {
    k: "evidence",
    tone: "var(--timing)",
    text: "every conclusion is labelled proven, observed, simulated, or unverified - and a conclusion is only as strong as its weakest input. reports are canonical json with sha256 evidence, optionally signed.",
  },
];

export function HowItKnows() {
  const ref = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
              gsap.utils.toArray<HTMLElement>("[data-layer]").forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            x: -34,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 80%" },
          });
        });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="hairline">
      <div className="wrap py-40">
        <p className="label">how it knows</p>
        <h2
          className="mt-3 font-bold"
          style={{ fontSize: "clamp(1.9rem,4.6vw,3rem)", letterSpacing: "-0.04em" }}
        >
          three layers, one verdict
        </h2>
        <div className="mt-14 flex flex-col">
          {LAYERS.map((l) => (
            <div key={l.k} data-layer className="hairline grid gap-3 py-9 sm:grid-cols-[11rem_1fr] sm:gap-8">
              <p className="mono text-sm font-bold" style={{ color: l.tone }}>
                {l.k}
              </p>
              <p className="lede" style={{ fontSize: "1rem" }}>
                {l.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================== */
/* cta                                                                */
/* ================================================================== */

const FLOW = [
  ["CREATE INDEX CONCURRENTLY …", "safe", "var(--safe)"],
  ["ADD COLUMN … DEFAULT gen_random_uuid()", "unsafe", "var(--unsafe)"],
  ["CREATE INDEX …", "needs_timing", "var(--timing)"],
  ["DROP COLUMN …", "safe_irreversible", "var(--irrev)"],
  ["ADD FOREIGN KEY … NOT VALID", "safe", "var(--safe)"],
  ["ALTER COLUMN … TYPE bigint", "unsafe", "var(--unsafe)"],
  ["VALIDATE CONSTRAINT …", "safe", "var(--safe)"],
  ["SET NOT NULL", "unknown", "var(--unknown)"],
];

export function Cta() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  useGSAP(
    () => {
              gsap.from("[data-c]", {
          opacity: 0,
          y: 26,
          stagger: 0.14,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: ref.current, start: "top 70%" },
        });
    },
    { scope: ref },
  );

  async function copy(cmd: string) {
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(cmd);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      /* selectable anyway */
    }
  }

  const CMDS = [
    "pip install blastoise",
    "blastoise check migrations/0042.sql --offline",
  ];

  return (
    <div id="start" ref={ref} className="hairline">
      <div className="wrap py-44 text-center">
        <h2
          data-c
          className="mx-auto max-w-2xl font-bold"
          style={{ fontSize: "clamp(2.2rem,6vw,4rem)", letterSpacing: "-0.045em", lineHeight: 1.05 }}
        >
          sixty seconds to a first verdict.
        </h2>
        <p data-c className="lede mx-auto mt-6 max-w-lg">
          <span className="mono text-[.92em]">--offline</span> needs nothing. a read-only
          url turns every unknown into an answer.
        </p>

        <div data-c className="mx-auto mt-12 flex max-w-md flex-col gap-3">
          {CMDS.map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => copy(cmd)}
              className="hairline group flex items-center justify-between gap-4 py-4 text-left"
              style={{ borderBottom: "1px solid var(--line)" }}
            >
              <span className="mono text-[13px]" style={{ color: "var(--ink)" }}>
                <span style={{ color: "var(--ink-faint)" }}>$ </span>
                {cmd}
              </span>
              <span
                className="mono text-xs"
                style={{ color: copied === cmd ? "var(--safe)" : "var(--ink-faint)" }}
              >
                {copied === cmd ? "copied" : "copy"}
              </span>
            </button>
          ))}
        </div>

        <div data-c className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <Magnetic href={REPO_URL} className="pill">
            github
          </Magnetic>
          <Magnetic href="/docs" className="pill pill-ghost">
            docs
          </Magnetic>
          {/* the repo isn't public yet, so this points at the locally
              rendered copy of the action's README instead of a 404 */}
          <Magnetic href="/docs/github-action" className="pill pill-ghost">
            the github action
          </Magnetic>
        </div>
      </div>

      <div className="marquee-mask pb-16" aria-hidden>
        <div className="marquee-track">
          {[...FLOW, ...FLOW].map(([sql, verdict, tone], i) => (
            <span key={i} className="mono flex items-center gap-3 text-[13px]" style={{ color: "var(--ink-faint)" }}>
              {sql}
              <span style={{ color: tone as string, fontWeight: 700 }}>→ {verdict}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
