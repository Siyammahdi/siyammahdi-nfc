"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { contact, profile, siteUrl } from "@/content/profile";
import { copyText, haptic, toast } from "@/lib/feedback";
import { Check, Copy, Share, WhatsApp } from "./icons";

export function CopyEmail() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="flex items-center gap-2 rounded-2xl border border-line bg-ink-2 p-1.5 pl-4">
      <a
        href={`mailto:${contact.email}`}
        className="min-w-0 flex-1 truncate text-[1.0625rem] tracking-[-0.01em] text-bone underline decoration-line-strong underline-offset-[6px] transition-colors hover:decoration-signal sm:text-lg"
      >
        {contact.email}
      </a>
      <motion.button
        type="button"
        whileTap={{ scale: 0.92 }}
        aria-label="Copy email address"
        onClick={async () => {
          haptic();
          if (await copyText(contact.email)) {
            setCopied(true);
            toast("Email copied");
            window.setTimeout(() => setCopied(false), 1800);
          }
        }}
        className="grid size-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-ink-3 text-bone transition-colors hover:bg-line-strong"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? "y" : "n"}
            initial={{ scale: 0.4, opacity: 0, rotate: -30 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.4, opacity: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 26 }}
            className={copied ? "text-signal" : undefined}
          >
            {copied ? <Check size={18} strokeWidth={2.2} /> : <Copy size={17} />}
          </motion.span>
        </AnimatePresence>
      </motion.button>
    </div>
  );
}

export function ClosingButtons() {
  const share = async () => {
    haptic();
    const data = {
      title: `${profile.name}, ${profile.role}`,
      text: profile.summary,
      url: siteUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(data);
      } catch {
        /* dismissed */
      }
      return;
    }
    if (await copyText(siteUrl)) toast("Link copied");
  };

  return (
    <div className="grid grid-cols-2 gap-2.5">
      <motion.a
        href={contact.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        whileTap={{ scale: 0.97 }}
        onClick={() => haptic()}
        className="flex h-14 items-center justify-center gap-2 rounded-2xl bg-signal font-medium text-ink"
      >
        <WhatsApp size={18} />
        Message me
      </motion.a>
      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={share}
        className="flex h-14 items-center justify-center gap-2 rounded-2xl border border-line-strong font-medium text-bone transition-colors hover:bg-ink-2"
      >
        <Share size={18} />
        Share card
      </motion.button>
    </div>
  );
}
