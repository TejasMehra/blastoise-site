import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { renderMarkdown, type Heading } from "./markdown";

const ROOT = process.cwd();
const DOCS_DIR = path.join(ROOT, "content", "docs");
const OUTPUT_DIR = path.join(ROOT, "content", "output");

/** Verbatim `blastoise check` / `blastoise ci` output, captured from real runs. */
export function readOutput(name: string): string {
  return readFileSync(path.join(OUTPUT_DIR, name), "utf8").replace(/\r\n/g, "\n");
}

export interface DocPage {
  slug: string;
  title: string;
  order: number;
  blurb: string;
}

/** The order the docs are meant to be read in. */
const DOC_META: Record<string, { title: string; order: number; blurb: string }> = {
  "how-it-works": {
    title: "How it works",
    order: 1,
    blurb:
      "The three layers - the parser, the lock catalog, and live introspection - and how to use each one from Python.",
  },
  tiers: {
    title: "The five verdicts",
    order: 2,
    blurb:
      "How a verdict is reached, the duration thresholds, the exit codes, and what each evidence tag means.",
  },
  reports: {
    title: "Reports and evidence",
    order: 3,
    blurb:
      "The Shell Report, the evidence bundle, signing, and the whole-pull-request `blastoise ci` command.",
  },
  "minimum-privilege-role": {
    title: "The database role",
    order: 4,
    blurb:
      "Three GRANT statements, no table access, no write ability - and what it refuses to do even when granted more.",
  },
  "github-action": {
    title: "The GitHub Action",
    order: 5,
    blurb:
      "The workflow, the config file, the Docker image, and how the connection string is kept out of every output.",
  },
};

export function listDocs(): DocPage[] {
  return readdirSync(DOCS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const meta = DOC_META[slug] ?? {
        title: slug,
        order: 99,
        blurb: "",
      };
      return { slug, ...meta };
    })
    .sort((a, b) => a.order - b.order);
}

export function readDoc(slug: string): {
  slug: string;
  title: string;
  html: string;
  headings: Heading[];
} | null {
  const file = path.join(DOCS_DIR, `${slug}.md`);
  let source: string;
  try {
    source = readFileSync(file, "utf8");
  } catch {
    return null;
  }
  const { html, headings } = renderMarkdown(source);
  return {
    slug,
    title: DOC_META[slug]?.title ?? slug,
    html,
    headings,
  };
}
