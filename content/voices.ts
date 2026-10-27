/**
 * Mirrors the main portfolio. Those quotes are marked there as stand-ins
 * until each person confirms the wording, so confirm before printing cards.
 */
export type Voice = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
};

export const voices: readonly Voice[] = [
  {
    id: "saad",
    quote:
      "Siyam took enrollment and billing seriously. The academy system shipped on time and stayed steady when real students came in.",
    name: "Saad Afnan",
    role: "CEO, An Nahda Academy",
    avatar: "/img/voices/saad-afnan.webp",
  },
  {
    id: "sam",
    quote:
      "He understood the rental floor. Machines, factories and statements finally live in one place the team can actually use.",
    name: "Sam Islam",
    role: "Marketing Strategist, Sewing Tech",
    avatar: "/img/voices/sam-islam.webp",
  },
  {
    id: "foysal",
    quote:
      "Clear communication and solid full-stack delivery on client and internal work. Easy to trust with the next build.",
    name: "Foysal Hossain",
    role: "Founder & CEO, Techwitpro",
    avatar: "/img/voices/foysal-hossain.webp",
  },
  {
    id: "fahim",
    quote:
      "The storefront and admin felt finished. We could sell and run the shop without chasing half-done pieces.",
    name: "Fahim Zaman",
    role: "Marketing Director, Mettalix",
    avatar: "/img/voices/fahim-zaman.webp",
  },
  {
    id: "shihab",
    quote:
      "Curious, reliable, and quick to grow. He treated every task like real product work, not just practice.",
    name: "Syed Shihab",
    role: "Founder & CEO, Uqidev",
    avatar: "/img/voices/syed-shihab.webp",
  },
];
