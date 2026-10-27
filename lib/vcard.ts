import { contact, profile, siteUrl } from "@/content/profile";

const escape = (v: string) => v.replace(/\\/g, "\\\\").replace(/([,;])/g, "\\$1").replace(/\n/g, "\\n");

/** vCard lines must be folded at 75 octets; continuation lines start with a space. */
function fold(line: string) {
  const out: string[] = [];
  for (let i = 0; i < line.length; i += 74) out.push((i ? " " : "") + line.slice(i, i + 74));
  return out.join("\r\n");
}

export function buildVCard(photoBase64?: string) {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escape(profile.lastName)};${escape(profile.firstName)};;;`,
    `FN:${escape(profile.name)}`,
    `ORG:${escape(profile.company)}`,
    `TITLE:${escape(profile.role)}`,
    `TEL;TYPE=CELL,VOICE:${contact.phone}`,
    `EMAIL;TYPE=INTERNET,PREF:${contact.email}`,
    `URL;TYPE=Portfolio:${siteUrl}`,
    `X-SOCIALPROFILE;TYPE=github:${contact.github}`,
    `X-SOCIALPROFILE;TYPE=linkedin:${contact.linkedin}`,
    `ADR;TYPE=WORK:;;;${escape(profile.city)};;;${escape(profile.country)}`,
    `NOTE:${escape(`${profile.summary} Saved from ${siteUrl}`)}`,
    ...(photoBase64 ? [`PHOTO;ENCODING=b;TYPE=JPEG:${photoBase64}`] : []),
    "END:VCARD",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}
