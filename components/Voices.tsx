"use client";

import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { useRef, useState, type CSSProperties } from "react";
import { voices, type Voice } from "@/content/voices";
import { haptic } from "@/lib/feedback";

const DURATION = 6500;
const HOLD_MS = 280;

/** Stories-style: tap right for next, left for previous, press and hold to pause. */
export function Voices() {
  const ref = useRef<HTMLDivElement>(null);
  const pressedAt = useRef(0);
  const inView = useInView(ref, { amount: 0.5 });
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [held, setHeld] = useState(false);
  const playing = inView && !held;

  const go = (step: number) => {
    if (Date.now() - pressedAt.current > HOLD_MS) return;
    haptic(6);
    setIndex((i) => (i + step + voices.length) % voices.length);
  };

  const release = () => setHeld(false);

  const barStyle = (i: number): CSSProperties => {
    if (i < index || (i === index && reduce)) return { transform: "scaleX(1)" };
    if (i > index) return { transform: "scaleX(0)" };
    return {
      animation: `voice-progress ${DURATION}ms linear forwards`,
      animationPlayState: playing ? "running" : "paused",
    };
  };

  return (
    <div
      ref={ref}
      className="relative select-none rounded-3xl border border-line bg-ink-2 p-6 sm:p-8"
      onPointerDown={() => {
        pressedAt.current = Date.now();
        setHeld(true);
      }}
      onPointerUp={release}
      onPointerLeave={release}
      onPointerCancel={release}
    >
      <div className="flex gap-1" aria-hidden>
        {voices.map((v, i) => (
          <span key={v.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-line-strong">
            <span
              key={i === index ? `on-${index}` : "off"}
              className="block h-full origin-left rounded-full bg-bone"
              style={barStyle(i)}
              onAnimationEnd={
                i === index && !reduce ? () => setIndex((n) => (n + 1) % voices.length) : undefined
              }
            />
          </span>
        ))}
      </div>

      <div className="mt-7 grid">
        {voices.map((v) => (
          <div key={v.id} aria-hidden className="invisible [grid-area:1/1]">
            <Quote voice={v} />
          </div>
        ))}
        <div className="[grid-area:1/1]">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={voices[index].id}
              initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            >
              <Quote voice={voices[index]} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous testimonial"
        className="absolute inset-y-0 left-0 w-1/3 rounded-l-3xl focus-visible:outline-offset-[-4px]"
        onClick={() => go(-1)}
      />
      <button
        type="button"
        aria-label="Next testimonial"
        className="absolute inset-y-0 right-0 w-2/3 rounded-r-3xl focus-visible:outline-offset-[-4px]"
        onClick={() => go(1)}
      />

      <p className="label pointer-events-none absolute bottom-6 right-6 text-dim sm:bottom-8 sm:right-8" aria-hidden>
        {String(index + 1).padStart(2, "0")} / {String(voices.length).padStart(2, "0")}
      </p>
    </div>
  );
}

function Quote({ voice }: { voice: Voice }) {
  return (
    <figure>
      <blockquote className="text-[1.3125rem] leading-[1.4] tracking-[-0.015em] text-bone sm:text-2xl">
        <span className="mr-1 font-serif text-3xl italic leading-none text-signal">“</span>
        {voice.quote}
      </blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <Image
          src={voice.avatar}
          alt=""
          width={40}
          height={40}
          className="size-10 rounded-full object-cover grayscale-[0.3]"
        />
        <span>
          <span className="block text-[0.9375rem] font-medium text-bone">{voice.name}</span>
          <span className="block text-[0.8125rem] text-mute">{voice.role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
