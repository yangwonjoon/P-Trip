import { useTranslations } from "next-intl";
import { CATEGORIES } from "@/shared/config";

export function HeroSection() {
  const t = useTranslations();

  return (
    <section className="bg-[var(--pt-purple-dark)] text-white px-6 py-12 text-center">
      <div className="w-[120px] h-[120px] rounded-full bg-white/10 mx-auto mb-6 flex items-center justify-center text-5xl">
        👹
      </div>

      <p className="text-sm text-white/70 mb-1">{t("hero.title")}</p>
      <h1 className="text-xl font-bold mb-2">{t("hero.subtitle")}</h1>
      <p className="text-sm text-white/60">{t("hero.tagline")}</p>

      <div className="flex justify-center gap-2 mt-4">
        {CATEGORIES.map((cat) => (
          <span
            key={cat.key}
            className="text-xs bg-white/10 rounded-full px-3 py-1"
          >
            {cat.emoji} {t(`categories.${cat.key}.label`)}
          </span>
        ))}
      </div>
    </section>
  );
}
