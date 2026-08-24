import type { Metadata } from "next";
import { listDocs } from "@/lib/content";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "How Blastoise works, the five verdicts, the reports it writes, and the read-only Postgres role it needs.",
};

export default function DocsIndex() {
  const docs = listDocs();

  return (
    <div>
      <h1
        className="font-bold tracking-tight"
        style={{ fontSize: "clamp(1.6rem,4vw,2.4rem)", color: "var(--ink)" }}
      >
        documentation
      </h1>
      <p className="lede mt-4 max-w-2xl">
        rendered from the repository&rsquo;s own markdown. this is where the site
        goes quiet - the prose and the code are the point.
      </p>

      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {docs.map((d) => (
          <a
            key={d.slug}
            href={`/docs/${d.slug}`}
            className="card block p-5 transition-transform duration-200 hover:-translate-y-1"
          >
            <p className="text-lg font-bold tracking-tight" style={{ color: "var(--ink)" }}>
              {d.title}
            </p>
            <p
              className="mt-2 text-sm leading-relaxed"
              style={{ color: "var(--ink-dim)" }}
            >
              {d.blurb}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
}
