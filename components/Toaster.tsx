"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { TOAST_EVENT } from "@/lib/feedback";
import { Check } from "./icons";

export function Toaster() {
  const [item, setItem] = useState<{ id: number; message: string } | null>(null);

  useEffect(() => {
    let timer: number | undefined;
    const onToast = (e: Event) => {
      const message = (e as CustomEvent<string>).detail;
      setItem({ id: Date.now(), message });
      window.clearTimeout(timer);
      timer = window.setTimeout(() => setItem(null), 2200);
    };
    window.addEventListener(TOAST_EVENT, onToast);
    return () => {
      window.removeEventListener(TOAST_EVENT, onToast);
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(max(0.75rem,env(safe-area-inset-bottom))+4.75rem)] z-50 flex justify-center lg:bottom-8"
    >
      <AnimatePresence mode="popLayout">
        {item && (
          <motion.div
            key={item.id}
            initial={{ y: 16, opacity: 0, scale: 0.9, filter: "blur(4px)" }}
            animate={{ y: 0, opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ y: -8, opacity: 0, scale: 0.96, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 460, damping: 32 }}
            className="flex items-center gap-2 rounded-full bg-bone py-2 pl-2.5 pr-4 text-sm font-medium text-ink shadow-[0_12px_40px_-8px_rgb(0_0_0/0.7)]"
          >
            <span className="grid size-5 place-items-center rounded-full bg-signal text-ink">
              <Check size={13} strokeWidth={2.4} />
            </span>
            {item.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
