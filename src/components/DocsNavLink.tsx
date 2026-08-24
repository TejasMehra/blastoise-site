"use client";

import { usePathname } from "next/navigation";

export function DocsNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <a
      href={href}
      aria-current={active ? "page" : undefined}
      className="block rounded-r-md px-3 py-2 text-sm transition-colors"
      style={{
        background: active ? "var(--surface-2)" : "transparent",
        color: active ? "var(--ink)" : "var(--ink-dim)",
        borderLeft: `3px solid ${active ? "var(--water)" : "transparent"}`,
      }}
    >
      {children}
    </a>
  );
}
