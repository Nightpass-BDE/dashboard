import type { Bde, BdeStatus } from "@/lib/types";

const STATUSES: { key: BdeStatus; label: string; colorVar: string }[] = [
  { key: "à contacter",       label: "À contacter",       colorVar: "var(--np-text-muted)" },
  { key: "contacté",          label: "Contacté",           colorVar: "var(--np-s1-text)" },
  { key: "en discussion",     label: "En discussion",      colorVar: "var(--np-s2-text)" },
  { key: "partenariat signé", label: "Partenariat signé",  colorVar: "var(--np-s3-text)" },
];

export function KpiCards({ bdes }: { bdes: Bde[] }) {
  const byStatus = bdes.reduce(
    (acc, b) => {
      acc[b.status] = (acc[b.status] ?? 0) + 1;
      return acc;
    },
    {} as Partial<Record<BdeStatus, number>>
  );

  return (
    <div
      className="grid grid-cols-5 gap-3 px-4 py-3 shrink-0"
      style={{ borderBottom: "1px solid var(--np-border)", background: "var(--np-bg)" }}
    >
      {/* Total */}
      <div
        className="rounded-xl px-4 py-3"
        style={{ background: "var(--np-surface)", border: "1px solid var(--np-border)" }}
      >
        <p className="text-2xl font-bold tabular-nums" style={{ color: "var(--np-text)" }}>
          {bdes.length}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--np-text-muted)" }}>
          Total BDE
        </p>
      </div>

      {STATUSES.map(({ key, label, colorVar }) => (
        <div
          key={key}
          className="rounded-xl px-4 py-3"
          style={{ background: "var(--np-surface)", border: "1px solid var(--np-border)" }}
        >
          <p className="text-2xl font-bold tabular-nums" style={{ color: colorVar }}>
            {byStatus[key] ?? 0}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--np-text-muted)" }}>
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
