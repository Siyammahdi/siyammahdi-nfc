/**
 * Everything the card says about Siyam lives here.
 * Copy is grounded in the main portfolio; update links before printing cards.
 */

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://siyammahdi.vercel.app"
).replace(/\/$/, "");

export const profile = {
  firstName: "Siyam",
  lastName: "Mahdi",
  name: "Siyam Mahdi",
  role: "Full-stack developer",
  company: "Techwitpro",
  title: "MERN Stack Developer",
  city: "Dhaka",
  country: "Bangladesh",
  coords: "23.81°N 90.41°E",
  timezone: "Asia/Dhaka",
  cardId: "SM/001",
  availability: "Open to select projects",
  summary:
    "Full-stack developer in Dhaka. I build products from the interface down to the server, then keep them running after launch.",
} as const;

export const contact = {
  email: "siyammahdi1@gmail.com",
  phone: "+8801635483536",
  phoneDisplay: "+880 1635-483536",
  whatsapp: "https://wa.me/8801635483536?text=Hi%20Siyam%2C%20I%20just%20tapped%20your%20card.",
  github: "https://github.com/Siyammahdi",
  linkedin: "https://www.linkedin.com/in/siyammahdi1",
  resume:
    "https://drive.google.com/file/d/1XqnJyi64MqNjZwXqeiRE96MOZDDKDRM5/view?usp=drive_link",
} as const;

export const facts = [
  { label: "Now", value: "MERN Stack Developer", detail: "Techwitpro, Dhaka" },
  { label: "Building", value: "2+ years", detail: "Client and agency work" },
  { label: "Reach", value: "Remote-ready", detail: "Teams anywhere, GMT+6" },
] as const;

export type Layer = {
  id: string;
  name: string;
  line: string;
  tools: readonly string[];
};

/** The stack, ordered the way a request travels through a product. */
export const layers: readonly Layer[] = [
  {
    id: "interface",
    name: "Interface",
    line: "Where I started, still my strongest ground.",
    tools: ["React", "Next.js", "TypeScript", "Tailwind", "Webflow"],
  },
  {
    id: "api",
    name: "API",
    line: "Typed routes and services with clear edges.",
    tools: ["Node.js", "Express", "NestJS"],
  },
  {
    id: "data",
    name: "Data",
    line: "Schemas that survive real users.",
    tools: ["PostgreSQL", "Prisma", "MongoDB", "Supabase", "Redis"],
  },
  {
    id: "auth",
    name: "Auth & money",
    line: "Roles, OTP, and billing that doesn't double charge.",
    tools: ["JWT", "Resend", "SSLCOMMERZ", "BullMQ"],
  },
  {
    id: "ship",
    name: "Ship",
    line: "Deployed, monitored, maintained.",
    tools: ["Docker", "Vercel", "Render", "Linux", "Git"],
  },
];

export const path = [
  {
    id: "techwitpro",
    when: "Now",
    role: "MERN Stack Developer",
    place: "Techwitpro",
    note: "Client products and internal systems, from first commit to production.",
  },
  {
    id: "uqidev",
    when: "Feb – Jun 2024",
    role: "Web Developer Intern",
    place: "Uqidev",
    note: "First professional step. Real tickets, real reviews.",
  },
  {
    id: "study",
    when: "Ongoing",
    role: "Diploma in CST",
    place: "Habiganj Polytechnic Institute",
    note: "Computer Science & Technology.",
  },
] as const;
