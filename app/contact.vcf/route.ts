import { readFile } from "node:fs/promises";
import path from "node:path";
import { buildVCard } from "@/lib/vcard";

async function getCard() {
  "use cache";
  const photo = await readFile(path.join(process.cwd(), "public/img/avatar.jpg"));
  return buildVCard(photo.toString("base64"));
}

export async function GET() {
  return new Response(await getCard(), {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'inline; filename="siyam-mahdi.vcf"',
    },
  });
}
