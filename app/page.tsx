import type { ReactNode } from "react";
import { PrimaryActions } from "@/components/Actions";
import { ClosingButtons, CopyEmail } from "@/components/ClosingActions";
import { ArrowUp } from "@/components/icons";
import { IdentityCard } from "@/components/IdentityCard";
import { Layers } from "@/components/Layers";
import { LiveClock } from "@/components/LiveClock";
import { QrCode } from "@/components/QrCode";
import { Reveal } from "@/components/Reveal";
import { StickyDock } from "@/components/StickyDock";
import { Toaster } from "@/components/Toaster";
import { Voices } from "@/components/Voices";
import { WorkGallery } from "@/components/WorkGallery";
import { contact, facts, path, profile, siteUrl } from "@/content/profile";
import { work } from "@/content/work";

export default function Home() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.role,
    worksFor: { "@type": "Organization", name: profile.company },
    address: { "@type": "PostalAddress", addressLocality: profile.city, addressCountry: profile.country },
    email: `mailto:${contact.email}`,
    url: siteUrl,
    sameAs: [contact.github, contact.linkedin],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />

      <div id="top" className="mx-auto max-w-[78rem] overflow-x-clip px-5 sm:px-8 lg:grid lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)] lg:gap-16 xl:gap-28">
        <aside className="flex flex-col pt-[max(1.25rem,env(safe-area-inset-top))] lg:h-dvh lg:justify-center lg:py-10 [@media(min-width:1024px)_and_(min-height:760px)]:sticky [@media(min-width:1024px)_and_(min-height:760px)]:top-0">
          <header className="fade-up flex items-center justify-between text-[0.8125rem]">
            <span className="flex items-center gap-2 text-bone/85">
              <span className="live-dot size-1.5 rounded-full bg-signal" />
              {profile.availability}
            </span>
            <span className="label flex items-center gap-1.5">
              {profile.city} <LiveClock />
            </span>
          </header>

          <div className="mt-6 sm:mt-10">
            <IdentityCard qr={<QrCode value={siteUrl} label={`QR code linking to ${siteUrl}`} />} />
          </div>

          <h1 className="sr-only">
            {profile.name}, {profile.role} in {profile.city}
          </h1>
          <p
            className="fade-up mt-5 text-balance text-center text-[1.0625rem] leading-[1.5] text-mute"
            style={{ animationDelay: "700ms" }}
          >
            Full-stack developer in Dhaka. I build products from the interface down to the server,{" "}
            <span className="font-serif text-[1.25rem] italic text-bone">then keep them running.</span>
          </p>

          <div className="fade-up mt-7" style={{ animationDelay: "850ms" }}>
            <PrimaryActions />
          </div>
        </aside>

        <main className="pb-28 pt-24 lg:pb-16 lg:pt-28">
          <Section label="About" id="about">
            <Reveal>
              <p className="text-[1.625rem] leading-[1.28] tracking-[-0.025em] text-bone/45 sm:text-[2.125rem]">
                <span className="text-bone">I started at the interface.</span> Clean screens, honest motion. Then the
                work pulled me down the stack: APIs, databases, auth, payments, deploys.{" "}
                <span className="text-bone">
                  Now I take products from first sketch to production,{" "}
                  <span className="font-serif italic tracking-[-0.01em] text-signal">and I stay after launch.</span>
                </span>
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <dl className="mt-12 grid grid-cols-1 border-t border-line sm:grid-cols-3">
                {facts.map((f) => (
                  <div
                    key={f.label}
                    className="flex items-baseline justify-between gap-4 border-b border-line py-4 sm:block sm:border-b-0 sm:border-r sm:px-5 sm:py-6 sm:first:pl-0 sm:last:border-r-0"
                  >
                    <dt className="label">{f.label}</dt>
                    <dd className="text-right sm:mt-3 sm:text-left">
                      <span className="block text-[1.0625rem] font-medium tracking-[-0.015em] text-bone">{f.value}</span>
                      <span className="block text-[0.8125rem] text-mute">{f.detail}</span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </Section>

          <Section label="Selected work" id="work" title="Real clients, real deadlines." aside={`0${work.length}`}>
            <Reveal>
              <WorkGallery />
            </Reveal>
          </Section>

          <Section label="How I build" id="stack" title="The stack, in the order a request travels.">
            <Layers />
          </Section>

          <Section label="Path" id="path" title="Short so far. Moving fast.">
            <Reveal>
              <ol className="border-t border-line">
                {path.map((p, i) => (
                  <li key={p.id} className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-line py-5 sm:grid-cols-[9rem_1fr]">
                    <span className={`label pt-1 ${i === 0 ? "text-signal" : ""}`}>{p.when}</span>
                    <div>
                      <p className="text-[1.0625rem] font-medium tracking-[-0.015em] text-bone">
                        {p.role} <span className="font-normal text-mute">at {p.place}</span>
                      </p>
                      <p className="mt-1 text-[0.9375rem] text-mute">{p.note}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Reveal>
          </Section>

          <Section label="Voices" id="voices" title="People I've built with.">
            <Reveal>
              <Voices />
            </Reveal>
          </Section>

          <section id="closing" className="mt-28 scroll-mt-10 sm:mt-36">
            <Reveal>
              <p className="label flex items-center gap-2">
                <span className="live-dot size-1.5 rounded-full bg-signal" />
                {profile.availability}
              </p>
              <h2 className="mt-5 text-[2.75rem] font-semibold leading-[0.95] tracking-[-0.05em] sm:text-[4rem]">
                Got something
                <br />
                <span className="font-serif font-normal italic tracking-[-0.02em] text-signal">real</span> to build?
              </h2>
              <p className="mt-5 max-w-md text-mute">
                Products where engineering and design meet are my favourite kind. Tell me what you&apos;re making and
                I&apos;ll get back to you.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="mt-9 space-y-2.5">
              <CopyEmail />
              <ClosingButtons />
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-10 hidden items-center gap-5 rounded-3xl border border-line p-5 lg:flex">
                <div className="size-28 shrink-0 rounded-2xl bg-bone p-2.5 text-ink">
                  <QrCode value={siteUrl} label="QR code to open this card on your phone" />
                </div>
                <div>
                  <p className="text-lg font-medium tracking-[-0.015em]">Take this card with you.</p>
                  <p className="mt-1 text-[0.9375rem] text-mute">
                    Scan with your phone camera to open it there, then save the contact in one tap.
                  </p>
                </div>
              </div>
            </Reveal>
          </section>

          <footer className="mt-20 flex items-center justify-between border-t border-line pt-6 text-[0.8125rem] text-dim">
            <span>
              © <Year /> {profile.name} · {profile.cardId}
            </span>
            <a href="#top" className="group flex items-center gap-1.5 transition-colors hover:text-bone">
              Back to top
              <ArrowUp size={14} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
            </a>
          </footer>
        </main>
      </div>

      <StickyDock />
      <Toaster />
    </>
  );
}

async function Year() {
  "use cache";
  return new Date().getFullYear();
}

function Section({
  id,
  label,
  title,
  aside,
  children,
}: {
  id: string;
  label: string;
  title?: string;
  aside?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="mt-24 scroll-mt-10 first:mt-0 sm:mt-32">
      <Reveal>
        <div className="mb-8 flex items-center gap-3">
          <span className="label text-bone/80">{label}</span>
          <span className="h-px flex-1 bg-line" />
          {aside && <span className="label tabular-nums">{aside}</span>}
        </div>
        {title && (
          <h2 className="mb-10 max-w-[22ch] text-[1.875rem] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[2.5rem]">
            {title}
          </h2>
        )}
      </Reveal>
      {children}
    </section>
  );
}
