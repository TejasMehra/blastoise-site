import { Marked } from "marked";

/** Stable, readable anchors for docs headings. */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/`/g, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export interface Heading {
  depth: number;
  text: string;
  id: string;
}

/**
 * Renders repo markdown to HTML. The content is ours and comes off disk at
 * build time, so there is no untrusted input to sanitise - but the renderer
 * still only ever emits the tags marked produces.
 */
export function renderMarkdown(source: string): {
  html: string;
  headings: Heading[];
} {
  const headings: Heading[] = [];
  const marked = new Marked({ gfm: true, breaks: false });

  marked.use({
    renderer: {
      heading({ tokens, depth }) {
        const text = this.parser.parseInline(tokens);
        const plain = text.replace(/<[^>]+>/g, "");
        const id = slugify(plain);
        if (depth <= 3) headings.push({ depth, text: plain, id });
        return `<h${depth} id="${id}">${text}</h${depth}>\n`;
      },
      // repo-relative links point at other docs pages on this site
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        let target = href;
        const titleAttr = title ? ` title="${title}"` : "";
        if (/^[\w./-]+\.md(#.*)?$/.test(href)) {
          const [file, hash] = href.split("#");
          const slug = file
            .replace(/^\.\//, "")
            .replace(/^\.\.\//, "")
            .replace(/\.md$/, "");
          target = `/docs/${slug}${hash ? `#${hash}` : ""}`;
        }
        const external = /^https?:\/\//.test(target);
        return `<a href="${target}"${titleAttr}${
          external ? ' target="_blank" rel="noreferrer noopener"' : ""
        }>${text}</a>`;
      },
    },
  });

  const html = marked.parse(source) as string;
  return { html, headings };
}
