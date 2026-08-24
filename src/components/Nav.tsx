"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { REPO_URL } from "@/lib/site";

export function Nav() {
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-colors duration-300"
      style={{
        background: solid ? "rgba(3,3,3,.75)" : "transparent",
        backdropFilter: solid ? "blur(10px)" : "none",
        borderBottom: `1px solid ${solid ? "var(--line)" : "transparent"}`,
      }}
    >
      <nav className="wrap flex items-center justify-between py-4" aria-label="main">
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <Image
            src="/assets/blastoise.png"
            alt=""
            width={24}
            height={24}
            unoptimized
            aria-hidden
            style={{ imageRendering: "pixelated" }}
          />
          <span className="text-[15px] font-semibold" style={{ letterSpacing: "-0.02em" }}>
            blastoise
          </span>
        </Link>

        <div className="flex items-center gap-7">
          <Link href="/docs" className="text-sm no-underline transition-colors hover:text-[var(--ink)]" style={{ color: "var(--ink-dim)" }}>
            docs
          </Link>
          <a href={REPO_URL} className="text-sm no-underline transition-colors hover:text-[var(--ink)]" style={{ color: "var(--ink-dim)" }}>
            github ↗
          </a>
        </div>
      </nav>
    </header>
  );
}
