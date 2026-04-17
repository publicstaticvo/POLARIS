import Link from "next/link";
import { ReactNode } from "react";

import { navLinks } from "@/lib/polaris-data";
import { cx } from "@/lib/utils";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-white/60 bg-shell/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-sm font-semibold tracking-[0.28em] text-shell shadow-panel">
            PL
          </div>
          <div>
            <p className="font-display text-lg text-ink">POLARIS IRT Core</p>
            <p className="text-xs uppercase tracking-[0.22em] text-ink/55">Submit Once, Ranked by Science</p>
          </div>
        </Link>
        <nav className="hidden flex-wrap items-center justify-end gap-2 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full border border-ink/10 bg-white/50 px-4 py-2 text-sm text-ink/80 transition hover:border-brand/40 hover:text-brand"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-ink/10 bg-ink text-shell">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1.5fr,1fr,1fr] lg:px-8">
        <div className="space-y-3">
          <p className="font-display text-2xl">POLARIS</p>
          <p className="max-w-xl text-sm leading-7 text-shell/70">
            面向大语言模型的 IRT + CAT 自适应评测平台，用更少的题量输出可比较、可解释、可追溯的能力参数。
          </p>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-shell/50">Core Pages</p>
          <div className="space-y-2 text-sm text-shell/80">
            {navLinks.slice(0, 5).map((link) => (
              <div key={link.href}>
                <Link href={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="mb-3 text-xs uppercase tracking-[0.24em] text-shell/50">Method</p>
          <div className="space-y-2 text-sm text-shell/80">
            <p>固定量尺与锚题校准</p>
            <p>MFI+ 自适应选题</p>
            <p>EAP 能力估计 + SE 置信度</p>
            <p>实时排行榜推送与报告生成</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function MainShell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-shell text-ink">{children}</div>;
}

export function PageIntro({
  eyebrow,
  title,
  description,
  aside
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-ink/10 bg-hero-grid">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-16 lg:grid-cols-[1.4fr,0.8fr] lg:px-8 lg:py-20">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.32em] text-brand">{eyebrow}</p>
          <h1 className="max-w-4xl font-display text-4xl leading-tight text-ink md:text-5xl">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-8 text-ink/72 md:text-lg">{description}</p>
        </div>
        {aside ? <div>{aside}</div> : null}
      </div>
    </section>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left"
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={cx("space-y-3", align === "center" && "text-center")}>
      <p className="text-xs uppercase tracking-[0.28em] text-brand">{eyebrow}</p>
      <h2 className="font-display text-3xl text-ink md:text-4xl">{title}</h2>
      {description ? <p className="max-w-3xl text-sm leading-7 text-ink/68 md:text-base">{description}</p> : null}
    </div>
  );
}

export function Panel({
  className,
  children
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cx("rounded-[28px] border border-ink/10 bg-white/78 p-6 shadow-panel backdrop-blur", className)}>
      {children}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  note
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <Panel className="h-full bg-white/70">
      <p className="text-xs uppercase tracking-[0.22em] text-ink/45">{label}</p>
      <p className="mt-4 font-display text-4xl text-ink">{value}</p>
      <p className="mt-3 text-sm leading-7 text-ink/65">{note}</p>
    </Panel>
  );
}

export function ActionLink({
  href,
  label,
  tone = "primary"
}: {
  href: string;
  label: string;
  tone?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex items-center rounded-full px-5 py-3 text-sm transition",
        tone === "primary"
          ? "bg-ink text-shell hover:bg-brand"
          : "border border-ink/12 bg-white/70 text-ink hover:border-brand/40 hover:text-brand"
      )}
    >
      {label}
    </Link>
  );
}
