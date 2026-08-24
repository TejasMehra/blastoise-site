import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { listDocs } from "@/lib/content";
import { DocsNavLink } from "@/components/DocsNavLink";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const docs = listDocs();

  return (
    <>
      <Nav />
      <div className="wrap py-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[15rem_1fr] lg:gap-12">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="eyebrow mb-3">documentation</p>
            <nav aria-label="Documentation">
              <ul className="flex flex-col gap-1">
                {docs.map((d) => (
                  <li key={d.slug}>
                    <DocsNavLink href={`/docs/${d.slug}`}>{d.title}</DocsNavLink>
                  </li>
                ))}
              </ul>
            </nav>
            <p className="mt-6">
              <a className="text-sm font-semibold" href="/" style={{ color: "var(--water)" }}>
                ← back to the site
              </a>
            </p>
          </aside>

          <main id="main" className="min-w-0">
            {children}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
