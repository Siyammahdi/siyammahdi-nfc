export type Shot = {
  src: string;
  width: number;
  height: number;
  label: string;
};

export type Work = {
  id: string;
  name: string;
  kind: string;
  year: string;
  timeline: string;
  client?: string;
  teaser: string;
  problem: string;
  built: string;
  result?: string;
  stack: readonly string[];
  cover: Shot;
  shots: readonly Shot[];
  liveUrl?: string;
  codeUrl?: string;
};

const shot = (src: string, label: string, height = 787): Shot => ({
  src: `/img/work/${src}.webp`,
  width: 1400,
  height,
  label,
});

export const work: readonly Work[] = [
  {
    id: "an-nahda-academy",
    name: "An Nahda Academy",
    kind: "Platform",
    year: "2025",
    timeline: "6 weeks",
    teaser: "Enrollment, subscriptions and billing for a real academy, on a hard deadline.",
    problem:
      "The academy needed one system for enrollment, students, teachers, courses and subscription billing. Classes happen on Telegram and Zoom, so this is the business layer, not an LMS.",
    built:
      "Capacity-safe enrollment, idempotent billing through SSLCOMMERZ, role-based access for admins, teachers and students, and background jobs for penalties, invoices and email.",
    result: "Live on Vercel and Render with OTP verification and backend test coverage.",
    stack: ["Next.js", "TypeScript", "Node.js", "Prisma", "PostgreSQL", "Redis", "BullMQ", "SSLCOMMERZ"],
    cover: shot("academy", "Product overview"),
    shots: [
      shot("academy-2", "Super Admin dashboard", 933),
      shot("academy-3", "Payments, roles and access", 933),
    ],
    liveUrl: "https://annahda-omega.vercel.app",
    codeUrl: "https://github.com/Siyammahdi/academy-management",
  },
  {
    id: "machine-rental-erp",
    name: "Machine Rental ERP",
    kind: "ERP",
    year: "2025",
    timeline: "10 weeks",
    client: "Sewing Tech International",
    teaser: "Which machines are out, which came back, and what every factory owes.",
    problem:
      "Sewing Tech rents garment machines to factories. They were tracking fleet, challans and dues across spreadsheets and memory.",
    built:
      "Fleet tracking across rent, stock and maintenance, delivery challans, invoicing, payments and per-factory statements in one system.",
    stack: ["Next.js", "TypeScript", "Express", "PostgreSQL", "Redis", "Docker"],
    cover: shot("rental", "Fleet overview", 788),
    shots: [
      shot("rental-2", "Dashboard and recent activity", 788),
      shot("rental-3", "Machines, challans and statements", 933),
    ],
  },
  {
    id: "nahda-shop",
    name: "Nahda Shop",
    kind: "Commerce",
    year: "2025",
    timeline: "5 weeks",
    teaser: "A premium fashion storefront with checkout and a quiet admin behind it.",
    problem:
      "The brand needed a public shop for browsing and buying, and somewhere calm to run products and orders day to day.",
    built:
      "Editorial storefront, cart and checkout, plus Nahda Admin for revenue, orders and catalog.",
    stack: ["Next.js", "React", "TypeScript", "Tailwind"],
    cover: shot("nahda", "Storefront"),
    shots: [
      shot("nahda-2", "Nahda Admin overview", 788),
      shot("nahda-3", "Product pages"),
    ],
    liveUrl: "https://nahdalife.vercel.app",
    codeUrl: "https://github.com/Siyammahdi/nahda-lifestyle",
  },
  {
    id: "nest-mart",
    name: "Nest Mart",
    kind: "Commerce",
    year: "2024",
    timeline: "4 weeks",
    teaser: "Grocery storefront plus the control room for orders, vendors and sales.",
    problem:
      "A grocery marketplace needed a shopping-ready storefront and a place to run catalog, orders and vendors.",
    built:
      "Responsive storefront with category browsing, and an admin dashboard for revenue, orders, products and vendors.",
    stack: ["React", "Node.js", "MongoDB", "Tailwind"],
    cover: shot("nest", "Storefront"),
    shots: [
      shot("nest-2", "Admin and sales overview", 788),
      shot("nest-3", "Desktop and mobile storefront", 788),
    ],
    liveUrl: "https://nest-mart-livid.vercel.app",
    codeUrl: "https://github.com/Siyammahdi/nest-mart",
  },
];
