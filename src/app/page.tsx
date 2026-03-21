import { COPY } from "@/shared/config";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero */}
      <section className="bg-[var(--pt-purple-dark)] text-white px-6 py-12 text-center">
        <div className="w-[120px] h-[120px] rounded-full bg-white/10 mx-auto mb-6 flex items-center justify-center text-4xl">
          👹
        </div>
        <p className="text-sm text-white/70 mb-1">{COPY.hero.title}</p>
        <h1 className="text-xl font-bold mb-2">{COPY.hero.subtitle}</h1>
        <p className="text-sm text-white/60">{COPY.hero.tagline}</p>
        <div className="flex justify-center gap-2 mt-4">
          <span className="text-xs bg-white/10 rounded-full px-3 py-1">🍲 food</span>
          <span className="text-xs bg-white/10 rounded-full px-3 py-1">🏯 spots</span>
          <span className="text-xs bg-white/10 rounded-full px-3 py-1">🛍 shop</span>
        </div>
      </section>

      {/* Location */}
      <section className="px-6 py-8">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
          {COPY.location.sectionLabel}
        </p>
        <p className="text-center text-sm text-muted-foreground mt-4 mb-4">
          {COPY.location.orPickCity}
        </p>
      </section>

      {/* Mode select */}
      <section className="px-6 pb-8">
        <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
          {COPY.mode.sectionLabel}
        </p>
      </section>

      {/* CTA */}
      <section className="px-6 pb-8 text-center">
        <p className="text-xs text-muted-foreground mt-4">{COPY.footer}</p>
      </section>
    </main>
  );
}
