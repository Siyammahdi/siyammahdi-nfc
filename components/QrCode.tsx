import { encode, QrCodeDataType } from "uqr";

type QrCodeProps = {
  value: string;
  className?: string;
  label?: string;
};

/**
 * Server-rendered QR: dots for data, rounded eyes for finder patterns.
 * Zero client JavaScript.
 */
export function QrCode({ value, className, label = "QR code" }: QrCodeProps) {
  const { data, types, size } = encode(value, { ecc: "M", border: 0 });

  const dots: string[] = [];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      if (!data[y][x] || types[y][x] === QrCodeDataType.Position) continue;
      dots.push(`M${x + 0.5} ${y + 0.08}a.42.42 0 1 1 0 .84a.42.42 0 1 1 0-.84`);
    }
  }

  const eyes = [
    [0, 0],
    [size - 7, 0],
    [0, size - 7],
  ];

  return (
    <svg
      viewBox={`-1.5 -1.5 ${size + 3} ${size + 3}`}
      className={className}
      role="img"
      aria-label={label}
      shapeRendering="geometricPrecision"
    >
      <path d={dots.join("")} fill="currentColor" />
      {eyes.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <rect x={x + 0.5} y={y + 0.5} width={6} height={6} rx={1.9} fill="none" stroke="currentColor" strokeWidth={1} />
          <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.9} fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}
