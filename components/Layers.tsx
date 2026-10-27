"use client";

import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { layers } from "@/content/profile";

/** The stack as a request path: the line fills and each layer lights as you scroll through it. */
export function Layers() {
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 78%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  const [lit, setLit] = useState(-1);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setLit(p <= 0.01 ? -1 : Math.min(layers.length - 1, Math.floor(p * layers.length)));
  });

  return (
    <ol ref={ref} className="relative">
      <span aria-hidden className="absolute bottom-6 left-[0.3125rem] top-2 w-px bg-line" />
      <motion.span
        aria-hidden
        className="absolute bottom-6 left-[0.28125rem] top-2 w-[2px] origin-top rounded-full bg-signal"
        style={{ scaleY: fill }}
      />
      {layers.map((layer, i) => {
        const on = i <= lit;
        return (
          <li key={layer.id} className="relative grid grid-cols-[0.6875rem_1fr] gap-x-5 pb-9 last:pb-0">
            <span
              aria-hidden
              className={`relative mt-[0.4rem] size-[0.6875rem] rounded-full border transition-all duration-500 ${
                on
                  ? "border-signal bg-signal shadow-[0_0_0_5px_rgb(255_90_31/0.14)]"
                  : "border-line-strong bg-ink"
              }`}
            />
            <div>
              <div className="flex items-baseline justify-between gap-4">
                <h3
                  className={`text-xl font-medium tracking-[-0.02em] transition-colors duration-500 ${
                    on ? "text-bone" : "text-bone/45"
                  }`}
                >
                  {layer.name}
                </h3>
                <span className="label shrink-0 text-dim">{`0${i + 1}`}</span>
              </div>
              <p className="mt-1 text-[0.9375rem] text-mute">{layer.line}</p>
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                {layer.tools.map((tool, t) => (
                  <li
                    key={tool}
                    className={`rounded-md border px-2 py-[0.3125rem] font-mono text-[0.6875rem] tracking-wide transition-all duration-500 ${
                      on ? "border-line-strong text-bone/85" : "border-line text-dim"
                    }`}
                    style={{ transitionDelay: on ? `${t * 45}ms` : "0ms" }}
                  >
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
