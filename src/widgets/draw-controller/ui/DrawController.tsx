"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CategorySelect } from "@/features/select-category";
import { ShuffleAnimation, DrawResult } from "@/features/draw-card";
import type { Coordinates } from "@/shared/config";
import { useDrawState } from "../model";

interface DrawControllerProps {
  coordinates?: Coordinates;
}

export function DrawController({ coordinates }: DrawControllerProps) {
  const {
    state,
    selectedCategory,
    setSelectedCategory,
    result,
    startShuffle,
    drawAgain,
  } = useDrawState(coordinates);

  return (
    <AnimatePresence mode="wait">
      {state === "select" && (
        <motion.div
          key="select"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <CategorySelect
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onShuffle={startShuffle}
          />
        </motion.div>
      )}

      {state === "shuffling" && (
        <motion.div
          key="shuffling"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
        >
          <ShuffleAnimation />
        </motion.div>
      )}

      {state === "result" && result && (
        <motion.div
          key="result"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <DrawResult place={result} onDrawAgain={drawAgain} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
