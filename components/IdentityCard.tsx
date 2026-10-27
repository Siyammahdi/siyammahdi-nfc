"use client";

import Image from "next/image";
import {
  motion,
  type MotionValue,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { profile, siteUrl } from "@/content/profile";
import { haptic } from "@/lib/feedback";
import { Contactless } from "./icons";

const clamp = (v: number) => Math.max(-1, Math.min(1, v));
const tiltSpring = { stiffness: 160, damping: 17, mass: 0.6 };

export function IdentityCard({ qr }: { qr: ReactNode }) {
  const reduce = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const press = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const [flipped, setFlipped] = useState(false);
  const [bursts, setBursts] = useState(0);
  const [touched, setTouched] = useState(false);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, tiltSpring);
  const sy = useSpring(py, tiltSpring);
  const flip = useSpring(0, { stiffness: 110, damping: 15, mass: 0.9 });

  const rotateY = useTransform(() => sx.get() * 16 + flip.get());
  const rotateX = useTransform(() => sy.get() * -11);
  const glareX = useTransform(sx, [-1, 1], [10, 90]);
  const glareY = useTransform(sy, [-1, 1], [5, 95]);
  const glare = useMotionTemplate`radial-gradient(90% 70% at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.13), transparent 60%)`;
  const portraitX = useTransform(sx, [-1, 1], [-7, 7]);
  const shadowX = useTransform(sx, [-1, 1], [18, -18]);

  useEffect(() => {
    flip.set(flipped ? 180 : 0);
  }, [flipped, flip]);

  // Android exposes orientation without a permission prompt; iOS does not, so it simply sits still.
  useEffect(() => {
    if (reduce) return;
    const DOE = window.DeviceOrientationEvent as unknown as
      | { requestPermission?: () => Promise<string> }
      | undefined;
    if (!DOE || typeof DOE.requestPermission === "function") return;
    if (!window.matchMedia("(pointer: coarse)").matches) return;

    let base: { b: number; g: number } | null = null;
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null || press.current) return;
      if (!base) base = { b: e.beta, g: e.gamma };
      base.b += (e.beta - base.b) * 0.015;
      base.g += (e.gamma - base.g) * 0.015;
      px.set(clamp((e.gamma - base.g) / 22));
      py.set(clamp((e.beta - base.b) / 22));
    };
    window.addEventListener("deviceorientation", onOrient);
    return () => window.removeEventListener("deviceorientation", onOrient);
  }, [reduce, px, py]);

  const pointTo = (clientX: number, clientY: number) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect || reduce) return;
    px.set(clamp(((clientX - rect.left) / rect.width) * 2 - 1));
    py.set(clamp(((clientY - rect.top) / rect.height) * 2 - 1));
  };

  const settle = () => {
    px.set(0);
    py.set(0);
  };

  const toggle = () => {
    haptic(10);
    setTouched(true);
    setBursts((n) => n + 1);
    setFlipped((f) => !f);
  };

  return (
    <div className="@container mx-auto w-full max-w-[25rem]">
      <div className="relative pt-[17cqw]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 aspect-[1.586] grid place-items-center"
      >
        {[0, 1, 2].map((i) => (
          <span
            key={`${bursts}-${i}`}
            className="signal-ring absolute aspect-square w-[78%] rounded-full border border-signal/50"
            style={{ animationDelay: `${(bursts === 0 ? 120 : 0) + i * 170}ms` }}
          />
        ))}
      </div>

      <div className="float">
        <div className="card-stage">
          <div
            ref={stageRef}
            role="button"
            tabIndex={0}
            aria-pressed={flipped}
            aria-label={flipped ? "Flip card to the front" : "Flip card to show a QR code"}
            className="relative aspect-[1.586] w-full select-none touch-pan-y outline-none [-webkit-touch-callout:none]"
            onPointerDown={(e) => {
              press.current = { x: e.clientX, y: e.clientY, moved: false };
              if (e.pointerType !== "mouse") pointTo(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => {
              const p = press.current;
              if (p && Math.hypot(e.clientX - p.x, e.clientY - p.y) > 8) p.moved = true;
              if (e.pointerType === "mouse" || p) pointTo(e.clientX, e.clientY);
            }}
            onPointerUp={(e) => {
              const p = press.current;
              press.current = null;
              if (e.pointerType !== "mouse") settle();
              if (p && !p.moved) toggle();
            }}
            onPointerCancel={() => {
              press.current = null;
              settle();
            }}
            onPointerLeave={(e) => {
              if (e.pointerType === "mouse") settle();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
              }
            }}
          >
            <motion.div
              aria-hidden
              className="absolute inset-x-[8%] -bottom-[9%] h-[30%] rounded-[50%] bg-black/70 blur-2xl"
              style={{ x: shadowX }}
            />
            <div className="card-intro absolute inset-0">
              <motion.div
                className="absolute inset-0"
                style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              >
                <Front glare={glare} portraitX={portraitX} />
                <Back qr={qr} />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <p
        className="label fade-up mt-5 flex items-center justify-center gap-2 text-dim transition-opacity duration-500"
        style={{ animationDelay: "1500ms", opacity: touched ? 0 : undefined }}
        aria-hidden
      >
        <span className="inline-block size-1 rounded-full bg-signal" />
        Tap the card
      </p>
    </div>
  );
}

function Front({
  glare,
  portraitX,
}: {
  glare: MotionValue<string>;
  portraitX: MotionValue<number>;
}) {
  return (
    <div className="card-face absolute inset-0">
      <div className="absolute inset-0 overflow-hidden rounded-[5cqw] bg-[linear-gradient(150deg,#22211d_0%,#141412_46%,#0b0b0a_100%)] shadow-[inset_0_1px_0_rgb(255_255_255/0.09),inset_0_0_0_1px_rgb(255_255_255/0.05)]">
        <div className="absolute -right-[10%] -top-[30%] aspect-square w-[70%] rounded-full bg-signal/25 blur-[12cqw]" />
        <div className="absolute inset-0 opacity-[0.35] [background-image:repeating-linear-gradient(90deg,rgb(255_255_255/0.035)_0_1px,transparent_1px_4cqw)]" />
        <motion.div className="absolute inset-0 mix-blend-plus-lighter" style={{ background: glare }} />
      </div>

      <div className="absolute -top-[24%] bottom-0 right-0 w-[68%] [clip-path:inset(0_0_0_0_round_0_0_5cqw_0)] [mask-image:linear-gradient(to_right,transparent_8%,#000_42%)]">
        <motion.div className="absolute inset-0" style={{ x: portraitX }}>
          <Image
            src="/img/portrait.webp"
            alt={`Portrait of ${profile.name}`}
            fill
            preload
            sizes="(min-width: 1024px) 280px, 68vw"
            className="origin-bottom scale-[1.04] object-contain object-bottom"
          />
        </motion.div>
      </div>

      <div className="absolute left-[6.5cqw] top-[6cqw] flex items-center gap-[2cqw] font-mono text-[2.7cqw] uppercase tracking-[0.12em] text-bone/70">
        <Contactless className="size-[5.5cqw] text-signal" strokeWidth={1.8} />
        <span>{profile.cardId}</span>
      </div>
      <p className="absolute left-[6.5cqw] top-[13.5cqw] font-mono text-[2.3cqw] uppercase tracking-[0.1em] text-bone/35">
        {profile.city} · {profile.coords}
      </p>

      <div className="absolute bottom-[6cqw] left-[6.5cqw]">
        <p className="text-[10.5cqw] font-semibold leading-[0.84] tracking-[-0.055em] text-bone">
          {profile.firstName}
          <br />
          {profile.lastName}
          <span className="text-signal">.</span>
        </p>
        <p className="mt-[3cqw] font-mono text-[2.6cqw] uppercase tracking-[0.14em] text-bone/55">
          {profile.role}
        </p>
      </div>
    </div>
  );
}

function Back({ qr }: { qr: ReactNode }) {
  const host = siteUrl.replace(/^https?:\/\//, "");
  return (
    <div className="card-face absolute inset-0 overflow-hidden rounded-[5cqw] bg-signal text-ink [transform:rotateY(180deg)] shadow-[inset_0_1px_0_rgb(255_255_255/0.3)]">
      <div className="absolute inset-0 opacity-40 [background-image:radial-gradient(120%_90%_at_0%_0%,rgb(255_255_255/0.45),transparent_55%)]" />
      <div className="relative flex h-full items-center gap-[6cqw] p-[6.5cqw]">
        <div className="aspect-square h-full shrink-0 rounded-[3.2cqw] bg-bone p-[3cqw] text-ink shadow-[0_2cqw_5cqw_rgb(0_0_0/0.18)]">
          {qr}
        </div>
        <div className="flex h-full min-w-0 flex-col justify-between py-[1cqw]">
          <p className="font-mono text-[2.6cqw] uppercase tracking-[0.14em] text-ink/60">
            {profile.cardId}
          </p>
          <div>
            <p className="whitespace-nowrap text-[5.6cqw] font-semibold leading-[0.95] tracking-[-0.04em]">
              Scan to save
              <br />
              <span className="font-serif text-[7cqw] font-normal italic tracking-[-0.02em]">
                my card.
              </span>
            </p>
            <p className="mt-[2.5cqw] break-all font-mono text-[2.3cqw] leading-snug text-ink/70">
              {host}
            </p>
          </div>
          <p className="font-mono text-[2.3cqw] uppercase tracking-[0.14em] text-ink/50">
            Tap to flip back
          </p>
        </div>
      </div>
    </div>
  );
}
