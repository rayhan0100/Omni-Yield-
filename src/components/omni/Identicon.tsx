export function Identicon({ seed, size = 32 }: { seed: string; size?: number }) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const cells: boolean[] = [];
  for (let i = 0; i < 25; i++) cells.push(((h >> i % 30) & (i * 7 + 3)) % 3 === 0);
  const palette = ["var(--neon)", "var(--teal)", "var(--violet)"];
  const fg = palette[h % 3];
  return (
    <svg width={size} height={size} viewBox="0 0 5 5" className="rounded-full ring-1 ring-border" aria-hidden>
      <rect width="5" height="5" fill="var(--surface-2)" />
      {cells.map((on, i) => {
        const x = i % 5;
        const y = Math.floor(i / 5);
        const mx = x > 2 ? 4 - x : x;
        const active = cells[y * 5 + mx];
        return active ? <rect key={i} x={x} y={y} width="1" height="1" fill={on || active ? fg : "transparent"} /> : null;
      })}
    </svg>
  );
}
