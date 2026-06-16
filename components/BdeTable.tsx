"use client";

import type { Bde, BdeStatus } from "@/lib/types";
import { ScoreBadge } from "./ScoreBadge";

export type SortKey = "name" | "school" | "city" | "followers" | "score" | "status";
export type SortDir = "asc" | "desc";

interface BdeTableProps {
  bdes: Bde[];
  sort: { key: SortKey; dir: SortDir };
  onSort: (key: SortKey) => void;
  selectedIds: Set<string>;
  onSelectAll: (ids: string[]) => void;
  onSelectOne: (id: string) => void;
  onRowClick: (bde: Bde) => void;
  onEditClick: (bde: Bde) => void;
  onStatusChange: (id: string, status: BdeStatus) => void;
}

const STATUS_OPTIONS: BdeStatus[] = [
  "à contacter",
  "contacté",
  "en discussion",
  "partenariat signé",
];

const STATUS_SELECT_VAR: Record<BdeStatus, [string, string, string]> = {
  "à contacter":       ["var(--np-s0-bg)", "var(--np-s0-text)", "var(--np-s0-ring)"],
  contacté:            ["var(--np-s1-bg)", "var(--np-s1-text)", "var(--np-s1-ring)"],
  "en discussion":     ["var(--np-s2-bg)", "var(--np-s2-text)", "var(--np-s2-ring)"],
  "partenariat signé": ["var(--np-s3-bg)", "var(--np-s3-text)", "var(--np-s3-ring)"],
};

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span
      className="ml-1 text-[10px]"
      style={{ color: active ? "var(--np-purple-light)" : "var(--np-text-dim)" }}
    >
      {active ? (dir === "asc" ? "↑" : "↓") : "↕"}
    </span>
  );
}

const COLS = ["name", "school", "city"] as const;
const COL_LABEL: Record<string, string> = { name: "Nom", school: "École", city: "Ville" };

export function BdeTable({
  bdes, sort, onSort,
  selectedIds, onSelectAll, onSelectOne,
  onRowClick, onEditClick, onStatusChange,
}: BdeTableProps) {
  const allSelected = bdes.length > 0 && bdes.every((b) => selectedIds.has(b.id));
  const someSelected = bdes.some((b) => selectedIds.has(b.id));

  const thBase: React.CSSProperties = {
    padding: "10px 12px",
    textAlign: "left",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "var(--np-text-muted)",
    cursor: "pointer",
    userSelect: "none",
    whiteSpace: "nowrap",
    borderBottom: "1px solid var(--np-border)",
    background: "var(--np-surface)",
    transition: "none",
  };

  const td: React.CSSProperties = {
    padding: "10px 12px",
    fontSize: "13px",
    color: "var(--np-text)",
    borderBottom: "1px solid var(--np-border)",
    whiteSpace: "nowrap",
    transition: "color 0.3s, border-color 0.3s",
  };

  return (
    <div className="overflow-auto h-full">
      <table className="w-full border-collapse min-w-[900px]">
        <thead style={{ position: "sticky", top: 0, zIndex: 10 }}>
          <tr>
            <th style={{ ...thBase, width: 40, cursor: "default" }}>
              <input
                type="checkbox"
                checked={allSelected}
                ref={(el) => { if (el) el.indeterminate = someSelected && !allSelected; }}
                onChange={() => onSelectAll(bdes.map((b) => b.id))}
                style={{ accentColor: "var(--np-purple)" }}
              />
            </th>

            {COLS.map((col) => (
              <th
                key={col}
                style={thBase}
                onClick={() => onSort(col)}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--np-text)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--np-text-muted)")}
              >
                {COL_LABEL[col]}
                <SortIcon active={sort.key === col} dir={sort.dir} />
              </th>
            ))}

            <th
              style={{ ...thBase, textAlign: "right" }}
              onClick={() => onSort("followers")}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--np-text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--np-text-muted)")}
            >
              Abonnés <SortIcon active={sort.key === "followers"} dir={sort.dir} />
            </th>

            <th
              style={{ ...thBase, textAlign: "center" }}
              onClick={() => onSort("score")}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--np-text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--np-text-muted)")}
            >
              Score <SortIcon active={sort.key === "score"} dir={sort.dir} />
            </th>

            <th
              style={thBase}
              onClick={() => onSort("status")}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--np-text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--np-text-muted)")}
            >
              Statut <SortIcon active={sort.key === "status"} dir={sort.dir} />
            </th>

            <th style={{ ...thBase, width: 32, cursor: "default" }} />
          </tr>
        </thead>

        <tbody>
          {bdes.map((bde) => {
            const [sBg, sText, sRing] = STATUS_SELECT_VAR[bde.status];
            return (
              <tr
                key={bde.id}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--np-row-hover)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                style={{ transition: "background 0.1s" }}
              >
                <td style={td} onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(bde.id)}
                    onChange={() => onSelectOne(bde.id)}
                    style={{ accentColor: "var(--np-purple)" }}
                  />
                </td>

                <td
                  style={{ ...td, fontWeight: 500, cursor: "pointer", maxWidth: 200 }}
                  className="truncate"
                  title={bde.name}
                  onClick={() => onRowClick(bde)}
                >
                  {bde.name}
                </td>

                <td
                  style={{ ...td, color: "var(--np-text-muted)", cursor: "pointer", maxWidth: 220 }}
                  className="truncate"
                  title={bde.school}
                  onClick={() => onRowClick(bde)}
                >
                  {bde.school}
                </td>

                <td style={{ ...td, color: "var(--np-text-muted)", cursor: "pointer" }} onClick={() => onRowClick(bde)}>
                  {bde.city}
                </td>

                <td style={{ ...td, textAlign: "right", fontVariantNumeric: "tabular-nums", color: "var(--np-text-muted)", cursor: "pointer" }} onClick={() => onRowClick(bde)}>
                  {bde.followers.toLocaleString("fr-FR")}
                </td>

                <td style={{ ...td, textAlign: "center", cursor: "pointer" }} onClick={() => onRowClick(bde)}>
                  <ScoreBadge score={bde.score} />
                </td>

                <td style={td} onClick={(e) => e.stopPropagation()}>
                  <select
                    value={bde.status}
                    onChange={(e) => onStatusChange(bde.id, e.target.value as BdeStatus)}
                    style={{
                      background: sBg,
                      color: sText,
                      border: `1px solid ${sRing}`,
                      fontSize: "11px",
                      fontWeight: 600,
                      borderRadius: "6px",
                      padding: "3px 8px",
                      outline: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s} style={{ background: "var(--np-select-bg)", color: "var(--np-text)" }}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>

                <td style={{ ...td, textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-center gap-1">
                    <button
                      title="Modifier"
                      onClick={() => onEditClick(bde)}
                      style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 4px", opacity: 0.5, transition: "opacity 0.15s" }}
                      onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                      onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
                    >
                      <img src="/ecrivez.png" alt="Modifier" width={14} height={14} className="np-icon-edit" style={{ display: "block" }} />
                    </button>
                    <button
                      title="Voir"
                      onClick={() => onRowClick(bde)}
                      style={{ color: "var(--np-text-dim)", transition: "color 0.15s", background: "none", border: "none", cursor: "pointer", padding: "2px 4px" }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "var(--np-purple-light)")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "var(--np-text-dim)")}
                    >
                      →
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}

          {bdes.length === 0 && (
            <tr>
              <td colSpan={8} style={{ ...td, textAlign: "center", padding: "48px 12px", color: "var(--np-text-dim)" }}>
                Aucun BDE ne correspond aux filtres sélectionnés
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
