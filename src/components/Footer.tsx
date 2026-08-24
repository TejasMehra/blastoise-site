import Image from "next/image";
import { REPO_URL, ISSUES_URL } from "@/lib/site";

export function Footer() {
  return (
    <footer className="hairline">
      <div className="wrap flex flex-col gap-8 py-14 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-sm">
          <p className="flex items-center gap-2.5">
            <Image
              src="/assets/blastoise.png"
              alt=""
              width={22}
              height={22}
              unoptimized
              aria-hidden
              style={{ imageRendering: "pixelated" }}
            />
            <span className="text-[15px] font-semibold" style={{ letterSpacing: "-0.02em" }}>
              blastoise
            </span>
          </p>
          <p className="mt-4 text-sm leading-relaxed" style={{ color: "var(--ink-faint)" }}>
            every number on this page is measured, and the measurements are committed in
            the repository next to the code that produced them.
          </p>
        </div>

        <nav aria-label="footer">
          <ul className="mono flex flex-col gap-2.5 text-sm sm:text-right">
            <li>
              <a href={REPO_URL} style={{ color: "var(--ink-dim)" }}>
                repository
              </a>
            </li>
            <li>
              <a href="/docs" style={{ color: "var(--ink-dim)" }}>
                documentation
              </a>
            </li>
            <li>
              <a href="/docs/minimum-privilege-role" style={{ color: "var(--ink-dim)" }}>
                the database role
              </a>
            </li>
            <li>
              <a href={ISSUES_URL} style={{ color: "var(--ink-dim)" }}>
                issues
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
