"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, Globe } from "lucide-react";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { cn } from "@/shared/lib";

interface HeaderProps {
  showBack?: boolean;
  city?: string;
}

const LOCALE_LABELS: Record<Locale, string> = {
  en: "EN",
  ko: "한",
  ja: "日",
  zh: "中",
};

export function Header({ showBack = false, city }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    if (langOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [langOpen]);

  const handleLocaleChange = (newLocale: Locale) => {
    setLangOpen(false);
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-between h-12 px-4 max-w-md mx-auto">
        {/* Left: back button */}
        <div className="w-8">
          {showBack && (
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Center: logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[var(--pt-purple-dark)] flex items-center justify-center">
            <span className="text-white text-xs font-bold">P</span>
          </div>
          <span className="font-semibold text-sm">P&apos;s Trip</span>
        </Link>

        {/* Right: city badge + language selector */}
        <div className="flex items-center gap-2">
          {city && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
              {city}
            </span>
          )}

          {/* 언어 선택 — click 토글 (모바일 터치 지원) */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => setLangOpen((prev) => !prev)}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-muted transition-colors"
              aria-label="Change language"
              aria-expanded={langOpen}
            >
              <Globe className="w-4 h-4" />
            </button>
            {langOpen && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-lg shadow-lg z-50 min-w-[48px]">
                {routing.locales.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => handleLocaleChange(loc)}
                    className={cn(
                      "block w-full px-4 py-2.5 text-sm text-left hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg",
                      locale === loc && "font-bold text-[var(--pt-purple)]"
                    )}
                  >
                    {LOCALE_LABELS[loc]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
