import { useTranslations } from "next-intl";

interface DokkaebiTipProps {
  tip: string;
}

export function DokkaebiTip({ tip }: DokkaebiTipProps) {
  const t = useTranslations();

  return (
    <div className="mx-6 rounded-xl bg-[var(--pt-purple-light)] p-4">
      <div className="flex items-start gap-3">
        <span className="text-xl">😊</span>
        <div>
          <p className="text-sm font-semibold text-[var(--pt-purple-dark)] mb-1">
            {t("dokkaebiTip")}
          </p>
          <p className="text-sm text-[var(--pt-purple-dark)]/80 leading-relaxed">
            &ldquo;{tip}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
