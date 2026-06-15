export function ScoreBadge({ score }: { score: number }) {
  const [bg, text, ring] =
    score >= 70
      ? ["var(--np-score-hi-bg)", "var(--np-score-hi-text)", "var(--np-score-hi-ring)"]
      : score >= 40
        ? ["var(--np-score-md-bg)", "var(--np-score-md-text)", "var(--np-score-md-ring)"]
        : ["var(--np-score-lo-bg)", "var(--np-score-lo-text)", "var(--np-score-lo-ring)"];

  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold tabular-nums"
      style={{ background: bg, color: text, border: `1px solid ${ring}`, transition: "all 0.3s" }}
    >
      {score}
    </span>
  );
}
