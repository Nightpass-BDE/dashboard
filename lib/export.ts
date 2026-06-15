import type { Bde } from "./types";

export function exportToCsv(bdes: Bde[], filename = "bdes-export.csv") {
  const headers = [
    "ID",
    "Nom",
    "École",
    "Ville",
    "Instagram",
    "Email",
    "Abonnés",
    "Score",
    "Statut",
    "Dernières soirées",
  ];

  const rows = bdes.map((b) => [
    b.id,
    b.name,
    b.school,
    b.city,
    b.instagram,
    b.email,
    b.followers.toString(),
    b.score.toString(),
    b.status,
    b.lastEventsDetected
      .map((e) => `${e.title} (${e.date})`)
      .join(" | "),
  ]);

  const csv = [headers, ...rows]
    .map((row) =>
      row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");

  const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
