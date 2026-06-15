import type { BdeStatus } from "@/lib/types";

const VAR: Record<BdeStatus, [string, string, string]> = {
  "à contacter":      ["var(--np-s0-bg)", "var(--np-s0-text)", "var(--np-s0-ring)"],
  contacté:           ["var(--np-s1-bg)", "var(--np-s1-text)", "var(--np-s1-ring)"],
  "en discussion":    ["var(--np-s2-bg)", "var(--np-s2-text)", "var(--np-s2-ring)"],
  "partenariat signé":["var(--np-s3-bg)", "var(--np-s3-text)", "var(--np-s3-ring)"],
};

const LABELS: Record<BdeStatus, string> = {
  "à contacter": "À contacter",
  contacté: "Contacté",
  "en discussion": "En discussion",
  "partenariat signé": "Partenariat signé",
};

export function StatusBadge({ status }: { status: BdeStatus }) {
  const [bg, text, ring] = VAR[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
      style={{ background: bg, color: text, border: `1px solid ${ring}`, transition: "all 0.3s" }}
    >
      {LABELS[status]}
    </span>
  );
}
