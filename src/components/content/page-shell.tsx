import type { ReactNode } from "react";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Container } from "@/components/ui/container";

/** Layout for CMS-style pages (SRS 9.1). Content moves to the content app's /pages/{slug}/ later. */
export function ContentPage({ eyebrow, title, intro, crumb, children, wide }: { eyebrow?: string; title: string; intro?: ReactNode; crumb: string; children: ReactNode; wide?: boolean }) {
  return (
    <>
      <header className="border-b border-line">
        <Container className="pt-6 pb-12 sm:pb-16">
          <Breadcrumbs items={[{ label: crumb }]} />
          <div className="mt-10 max-w-3xl">
            {eyebrow && <p className="eyebrow mb-4 text-clay">{eyebrow}</p>}
            <h1 className="text-4xl sm:text-6xl">{title}</h1>
            {intro && <div className="mt-6 text-lg leading-relaxed text-ink-soft sm:text-xl">{intro}</div>}
          </div>
        </Container>
      </header>
      <Container size={wide ? "default" : "narrow"} className="py-12 sm:py-16">
        {children}
      </Container>
    </>
  );
}
