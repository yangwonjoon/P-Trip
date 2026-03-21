"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const CARDS = [
  { rotate: -8, bg: "bg-[var(--pt-purple)]/30", delay: 0 },
  { rotate: -3, bg: "bg-[var(--pt-purple)]/60", delay: 0.1 },
  { rotate: 2, bg: "bg-[var(--pt-purple)]", delay: 0.2 },
];

export function ShuffleAnimation() {
  const t = useTranslations();

  return (
    <div className="flex flex-col items-center px-6 py-12">
      <div className="relative w-48 h-64 mb-8">
        {CARDS.map((card, i) => (
          <motion.div
            key={i}
            className={`absolute inset-0 rounded-2xl ${card.bg} border border-white/20 flex items-center justify-center`}
            initial={{ rotate: 0, y: 0 }}
            animate={{
              rotate: [card.rotate, card.rotate + 6, card.rotate - 6, card.rotate],
              y: [0, -8, 4, 0],
            }}
            transition={{
              duration: 1.2,
              delay: card.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {i === CARDS.length - 1 && <span className="text-4xl">👹</span>}
          </motion.div>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-2">{t("draw.shufflingTitle")}</h2>
      <p className="text-sm text-muted-foreground mb-6">
        {t("draw.shufflingSub")}
      </p>

      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-[var(--pt-purple)]"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
          />
        ))}
      </div>
    </div>
  );
}
