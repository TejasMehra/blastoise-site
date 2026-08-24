import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { listDocs, readDoc } from "@/lib/content";

export function generateStaticParams() {
  return listDocs().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const doc = listDocs().find((d) => d.slug === slug);
  if (!doc) return {};
  return { title: doc.title, description: doc.blurb };
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const doc = readDoc(slug);
  if (!doc) notFound();

  const toc = doc.headings.filter((h) => h.depth === 2);

  return (
    <article className="min-w-0">
      {toc.length > 1 && (
        <nav
          className="card-flat mb-9 px-5 py-4"
          aria-label={`On this page: ${doc.title}`}
        >
          <p className="eyebrow mb-2.5">on this page</p>
          <ul className="flex flex-col gap-1">
            {toc.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className="text-sm"
                  style={{ color: "var(--ink-dim)" }}
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <div className="prose" dangerouslySetInnerHTML={{ __html: doc.html }} />
    </article>
  );
}
