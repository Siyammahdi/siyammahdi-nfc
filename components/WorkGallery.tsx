"use client";

import Image from "next/image";
import { AnimatePresence, motion, useDragControls, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { contact } from "@/content/profile";
import { work, type Work } from "@/content/work";
import { haptic } from "@/lib/feedback";
import { ArrowUpRight, Close, GitHub, WhatsApp } from "./icons";

const pad = (n: number) => String(n).padStart(2, "0");

export function WorkGallery() {
  const railRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<Work | null>(null);

  const onScroll = () => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = Array.from(rail.children) as HTMLElement[];
    const center = rail.scrollLeft + rail.clientWidth / 2;
    let best = 0;
    cards.forEach((c, i) => {
      if (Math.abs(c.offsetLeft + c.offsetWidth / 2 - center) < Math.abs(cards[best].offsetLeft + cards[best].offsetWidth / 2 - center)) best = i;
    });
    if (best !== active) {
      haptic(4);
      setActive(best);
    }
  };

  return (
    <>
      <div
        ref={railRef}
        onScroll={onScroll}
        className="no-scrollbar -mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 sm:-mx-8 sm:scroll-px-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-2 lg:gap-x-5 lg:gap-y-10 lg:overflow-visible lg:px-0"
      >
        {work.map((item, i) => (
          <WorkCard key={item.id} item={item} index={i} onOpen={() => setOpen(item)} />
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3 lg:hidden" aria-hidden>
        <span className="label tabular-nums text-bone">{pad(active + 1)}</span>
        <div className="flex flex-1 gap-1">
          {work.map((w, i) => (
            <span
              key={w.id}
              className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${i === active ? "bg-signal" : "bg-line-strong"}`}
            />
          ))}
        </div>
        <span className="label tabular-nums">{pad(work.length)}</span>
      </div>

      <WorkSheet item={open} onClose={() => setOpen(null)} />
    </>
  );
}

function WorkCard({ item, index, onOpen }: { item: Work; index: number; onOpen: () => void }) {
  return (
    <motion.button
      type="button"
      onClick={() => {
        haptic(8);
        onOpen();
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 30 }}
      className="group flex w-[84%] shrink-0 snap-start flex-col justify-start text-left sm:w-[62%] lg:w-auto"
    >
      <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-line bg-ink-2">
        <Image
          src={item.cover.src}
          alt={`${item.name}: ${item.cover.label}`}
          fill
          sizes="(min-width: 1024px) 340px, 84vw"
          className="object-cover transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.045]"
        />
        <span className="absolute inset-0 bg-[linear-gradient(to_top,rgb(13_13_12/0.55),transparent_45%)]" />
        <span className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-bone text-ink transition-transform duration-500 ease-out-expo group-hover:rotate-45">
          <ArrowUpRight size={16} strokeWidth={2} />
        </span>
        <span className="label absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-bone/85 backdrop-blur-md">
          {item.kind}
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-3">
        <span className="label text-signal">{pad(index + 1)}</span>
        <h3 className="text-lg font-medium tracking-[-0.02em] text-bone">{item.name}</h3>
        <span className="label ml-auto text-dim">{item.year}</span>
      </div>
      <p className="mt-1.5 pl-[2.1rem] text-[0.9375rem] leading-relaxed text-mute">{item.teaser}</p>
    </motion.button>
  );
}

const desktopQuery = "(min-width: 1024px)";
function useIsDesktop() {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia(desktopQuery);
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia(desktopQuery).matches,
    () => false,
  );
}

const noop = () => () => {};

function WorkSheet({ item, onClose }: { item: Work | null; onClose: () => void }) {
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const desktop = useIsDesktop();
  const reduce = useReducedMotion();
  const drag = useDragControls();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!item) return;
    const previous = document.activeElement as HTMLElement | null;
    const root = document.documentElement;
    const prevOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
      previous?.focus({ preventScroll: true });
    };
  }, [item, onClose]);

  const hidden = desktop || reduce ? { opacity: 0, y: 24, scale: 0.98 } : { y: "100%" };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {item && (
        <div key={item.id} className="fixed inset-0 z-50 flex items-end justify-center lg:items-center lg:p-8">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sheet-title"
            className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[1.75rem] border border-line-strong bg-ink-2 lg:max-h-[88dvh] lg:rounded-[1.75rem]"
            initial={hidden}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={hidden}
            transition={{ type: "spring", stiffness: 340, damping: 36, mass: 0.9 }}
            drag={desktop ? false : "y"}
            dragControls={drag}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.7 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 650) onClose();
            }}
          >
            <div
              className="flex shrink-0 touch-none items-center justify-between px-5 pb-3 pt-3 lg:px-7 lg:pt-5"
              onPointerDown={(e) => !desktop && drag.start(e)}
            >
              <span className="label">
                {item.kind} · {item.year} · {item.timeline}
              </span>
              <span aria-hidden className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-line-strong lg:hidden" />
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close project"
                className="grid size-9 place-items-center rounded-full bg-ink-3 text-bone transition-colors hover:bg-line-strong"
              >
                <Close size={16} />
              </button>
            </div>

            <div className="no-scrollbar overflow-y-auto overscroll-contain pb-4">
              <div className="no-scrollbar flex snap-x snap-mandatory gap-2.5 overflow-x-auto scroll-px-5 px-5 lg:scroll-px-7 lg:px-7">
                {[item.cover, ...item.shots].map((s, i) => (
                  <motion.figure
                    key={s.src}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.12 + i * 0.07, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="w-[88%] shrink-0 snap-start"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-line bg-ink">
                      <Image src={s.src} alt={s.label} fill sizes="(min-width: 1024px) 560px, 88vw" className="object-cover" />
                    </div>
                    <figcaption className="label mt-2 text-dim">{s.label}</figcaption>
                  </motion.figure>
                ))}
              </div>

              <div className="px-5 pt-6 lg:px-7">
                <h2 id="sheet-title" className="text-[2rem] font-semibold leading-[1.02] tracking-[-0.04em]">
                  {item.name}
                </h2>
                {item.client && <p className="mt-2 text-mute">for {item.client}</p>}

                <dl className="mt-7 space-y-6">
                  <Chapter title="The problem" body={item.problem} />
                  <Chapter title="What I built" body={item.built} />
                  {item.result && <Chapter title="Where it landed" body={item.result} />}
                </dl>

                <ul className="mt-7 flex flex-wrap gap-1.5">
                  {item.stack.map((s) => (
                    <li key={s} className="rounded-md border border-line-strong px-2 py-[0.3125rem] font-mono text-[0.6875rem] tracking-wide text-bone/80">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex shrink-0 gap-2 border-t border-line bg-ink-2 px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 lg:px-7 lg:pb-5">
              {item.liveUrl ? (
                <a
                  href={item.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-bone font-medium text-ink"
                >
                  Visit live site <ArrowUpRight size={16} strokeWidth={2} />
                </a>
              ) : (
                <a
                  href={contact.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-bone font-medium text-ink"
                >
                  <WhatsApp size={17} /> Private build. Ask for a walkthrough
                </a>
              )}
              {item.codeUrl && (
                <a
                  href={item.codeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.name} source on GitHub`}
                  className="grid size-12 shrink-0 place-items-center rounded-2xl border border-line-strong text-bone transition-colors hover:bg-ink-3"
                >
                  <GitHub size={19} />
                </a>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

function Chapter({ title, body }: { title: string; body: string }) {
  return (
    <div className="grid gap-1.5 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
      <dt className="label pt-1 text-signal">{title}</dt>
      <dd className="text-[0.9875rem] leading-relaxed text-bone/80">{body}</dd>
    </div>
  );
}
