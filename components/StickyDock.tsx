"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { contact } from "@/content/profile";
import { haptic } from "@/lib/feedback";
import { SaveContactButton } from "./Actions";
import { Mail, WhatsApp } from "./icons";

/** Mobile-only: keeps the two things a visitor came for one thumb away. */
export function StickyDock() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const actions = document.getElementById("primary-actions");
    const closing = document.getElementById("closing");
    if (!actions) return;

    const seen = new Map<Element, boolean>();
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) seen.set(e.target, e.isIntersecting);
      const actionsGone = seen.get(actions) === false && actions.getBoundingClientRect().top < 0;
      setShow(actionsGone && !(closing && seen.get(closing)));
    });
    io.observe(actions);
    if (closing) io.observe(closing);
    return () => io.disconnect();
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 110, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 110, opacity: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 34 }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden"
        >
          <div className="mx-auto flex max-w-md items-center gap-2 rounded-[1.375rem] border border-line-strong bg-ink-2/80 p-1.5 shadow-[0_20px_50px_-10px_rgb(0_0_0/0.8)] backdrop-blur-xl">
            <SaveContactButton compact />
            <DockIcon href={contact.whatsapp} label="WhatsApp" external>
              <WhatsApp size={20} />
            </DockIcon>
            <DockIcon href={`mailto:${contact.email}`} label="Email">
              <Mail size={20} />
            </DockIcon>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DockIcon({
  href,
  label,
  external,
  children,
}: {
  href: string;
  label: string;
  external?: boolean;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      aria-label={label}
      onClick={() => haptic()}
      whileTap={{ scale: 0.9 }}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="grid size-12 shrink-0 place-items-center rounded-2xl bg-ink-3 text-bone"
    >
      {children}
    </motion.a>
  );
}
