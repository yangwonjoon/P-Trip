import { COPY, CATEGORIES } from "@/shared/config";

export function HeroSection() {
  return (
    <section className="bg-[var(--pt-purple-dark)] text-white px-6 py-12 text-center">
      {/* 도깨비 플레이스홀더 */}
      <div className="w-[120px] h-[120px] rounded-full bg-white/10 mx-auto mb-6 flex items-center justify-center text-5xl">
        👹
      </div>

      {/* 카피 */}
      <p className="text-sm text-white/70 mb-1">{COPY.hero.title}</p>
      <h1 className="text-xl font-bold mb-2">{COPY.hero.subtitle}</h1>
      <p className="text-sm text-white/60">{COPY.hero.tagline}</p>

      {/* 카테고리 태그 pills */}
      <div className="flex justify-center gap-2 mt-4">
        {CATEGORIES.map((cat) => (
          <span
            key={cat.key}
            className="text-xs bg-white/10 rounded-full px-3 py-1"
          >
            {cat.emoji} {cat.key.toLowerCase()}
          </span>
        ))}
      </div>
    </section>
  );
}
