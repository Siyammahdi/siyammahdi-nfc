"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { contact } from "@/content/profile";
import { haptic, toast } from "@/lib/feedback";
import {
  ArrowUpRight,
  Check,
  FileText,
  GitHub,
  LinkedIn,
  Mail,
  Phone,
  UserPlus,
  WhatsApp,
} from "./icons";

export function SaveContactButton({ compact = false }: { compact?: boolean }) {
  const [saved, setSaved] = useState(false);

  return (
    <motion.a
      href="/contact.vcf"
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      onClick={() => {
        haptic(12);
        setSaved(true);
        toast("Contact card opened");
        window.setTimeout(() => setSaved(false), 2600);
      }}
      className={`group relative flex items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-bone font-medium text-ink shadow-[inset_0_-2px_0_rgb(0_0_0/0.12)] ${
        compact ? "h-12 flex-1 px-4 text-[0.9375rem]" : "h-14 w-full text-base"
      }`}
    >
      <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(100deg,transparent,rgb(255_255_255/0.6),transparent)] transition-transform duration-700 ease-out group-hover:translate-x-full" />
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={saved ? "saved" : "idle"}
          initial={{ y: 18, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -18, opacity: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 30 }}
          className="relative flex items-center gap-2.5"
        >
          {saved ? <Check size={19} strokeWidth={2} /> : <UserPlus size={19} />}
          {saved ? "Opening contacts" : "Save my contact"}
        </motion.span>
      </AnimatePresence>
    </motion.a>
  );
}

function Tile({ href, label, icon, external }: { href: string; label: string; icon: ReactNode; external?: boolean }) {
  return (
    <motion.a
      href={href}
      onClick={() => haptic()}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 500, damping: 28 }}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex h-[4.25rem] flex-col items-center justify-center gap-1.5 rounded-2xl border border-line bg-ink-2 text-[0.8125rem] text-bone/80 transition-colors hover:border-line-strong hover:bg-ink-3 hover:text-bone"
    >
      <span className="text-bone transition-transform duration-300 ease-out group-hover:-translate-y-0.5">{icon}</span>
      {label}
    </motion.a>
  );
}

export function PrimaryActions() {
  return (
    <div id="primary-actions" className="space-y-2.5">
      <SaveContactButton />
      <div className="grid grid-cols-3 gap-2.5">
        <Tile href={contact.whatsapp} label="WhatsApp" icon={<WhatsApp size={19} />} external />
        <Tile href={`tel:${contact.phone}`} label="Call" icon={<Phone size={18} />} />
        <Tile href={`mailto:${contact.email}`} label="Email" icon={<Mail size={18} />} />
      </div>
      <div className="flex items-center justify-center pt-2">
        <SocialLink href={contact.github} icon={<GitHub size={15} />} label="GitHub" />
        <SocialLink href={contact.linkedin} icon={<LinkedIn size={15} />} label="LinkedIn" />
        <SocialLink href={contact.resume} icon={<FileText size={15} />} label="Résumé" />
      </div>
    </div>
  );
}

function SocialLink({ href, icon, label }: { href: string; icon: ReactNode; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex h-9 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-sm text-mute transition-colors hover:bg-ink-2 hover:text-bone sm:px-3"
    >
      {icon}
      {label}
      <ArrowUpRight size={13} className="opacity-50 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100" />
    </a>
  );
}
