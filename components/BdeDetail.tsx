"use client";

import type { Bde, BdeStatus } from "@/lib/types";
import { ScoreBadge } from "./ScoreBadge";
import { StatusBadge } from "./StatusBadge";

interface BdeDetailProps {
  bde: Bde | null;
  onClose: () => void;
  onStatusChange: (id: string, status: BdeStatus) => void;
}

export function BdeDetail({ bde, onClose, onStatusChange }: BdeDetailProps) {
  if (!bde) return null;

  const instagramUrl = bde.instagram.startsWith("http")
    ? bde.instagram
    : `https://instagram.com/${bde.instagram.replace(/^@/, "")}`;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(2px)" }}
        onClick={onClose}
      />

      <aside
        className="fixed right-0 top-0 h-full z-50 flex flex-col"
        style={{
          width: 400,
          background: "var(--np-surface)",
          borderLeft: "1px solid var(--np-border)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between p-5 shrink-0"
          style={{ borderBottom: "1px solid var(--np-border)" }}
        >
          <div>
            <h2 className="text-base font-semibold" style={{ color: "var(--np-text)" }}>{bde.name}</h2>
            <p className="text-sm mt-0.5" style={{ color: "var(--np-text-muted)" }}>
              {bde.school}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-4 p-1.5 rounded-lg transition-colors"
            style={{ color: "var(--np-text-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--np-surface-2)";
              e.currentTarget.style.color = "white";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--np-text-muted)";
            }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Score + status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "var(--np-text-muted)" }}>Score</span>
              <ScoreBadge score={bde.score} />
            </div>
            <div style={{ width: 1, height: 16, background: "var(--np-border)" }} />
            <StatusBadge status={bde.status} />
          </div>

          {/* Info grid */}
          <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
            {/* Ville */}
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--np-text-dim)" }}>Ville</dt>
              <dd className="text-sm mt-0.5" style={{ color: "var(--np-text)" }}>{bde.city}</dd>
            </div>

            {/* Abonnés */}
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--np-text-dim)" }}>Abonnés Instagram</dt>
              <dd className="text-sm mt-0.5 tabular-nums" style={{ color: "var(--np-text)" }}>{bde.followers.toLocaleString("fr-FR")}</dd>
            </div>

            {/* Email */}
            <div className="col-span-2">
              <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--np-text-dim)" }}>Email</dt>
              <dd className="mt-0.5">
                <a href={`mailto:${bde.email}`} className="text-sm hover:underline" style={{ color: "var(--np-purple-light)" }}>
                  {bde.email}
                </a>
              </dd>
            </div>

            {/* Téléphone */}
            {bde.phone && (
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--np-text-dim)" }}>Téléphone</dt>
                <dd className="mt-0.5">
                  <a href={`tel:${bde.phone}`} className="text-sm hover:underline" style={{ color: "var(--np-purple-light)" }}>
                    {bde.phone}
                  </a>
                </dd>
              </div>
            )}

            {/* Instagram */}
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--np-text-dim)" }}>Instagram</dt>
              <dd className="mt-0.5">
                <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: "var(--np-purple-light)" }}>
                  {bde.instagram}
                </a>
              </dd>
            </div>

            {/* Site web */}
            {bde.website && (
              <div className="col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--np-text-dim)" }}>Site web</dt>
                <dd className="mt-0.5">
                  <a href={bde.website} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline truncate block" style={{ color: "var(--np-purple-light)" }}>
                    {bde.website.replace(/^https?:\/\//, "")}
                  </a>
                </dd>
              </div>
            )}
          </dl>

          <div style={{ height: 1, background: "var(--np-border)" }} />

          {/* Events */}
          <div>
            <h3
              className="text-xs font-medium uppercase tracking-wide mb-3"
              style={{ color: "var(--np-text-dim)" }}
            >
              Dernières soirées détectées
            </h3>
            {bde.lastEventsDetected.length === 0 ? (
              <p className="text-sm italic" style={{ color: "var(--np-text-dim)" }}>
                Aucune soirée détectée
              </p>
            ) : (
              <ul className="space-y-2">
                {bde.lastEventsDetected.map((event, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between text-sm rounded-lg px-3 py-2"
                    style={{
                      background: "var(--np-surface-2)",
                      border: "1px solid var(--np-border)",
                    }}
                  >
                    <span className="font-medium" style={{ color: "var(--np-text)" }}>{event.title}</span>
                    <span className="text-xs ml-3 shrink-0" style={{ color: "var(--np-text-muted)" }}>
                      {event.date}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="p-5 shrink-0 space-y-2"
          style={{ borderTop: "1px solid var(--np-border)" }}
        >
          <button
            onClick={() => onStatusChange(bde.id, "à contacter")}
            disabled={bde.status === "à contacter"}
            className="w-full py-2 text-sm font-medium rounded-lg transition-opacity disabled:opacity-30"
            style={{
              border: "1px solid var(--np-border)",
              color: "var(--np-text-muted)",
              background: "transparent",
            }}
            onMouseEnter={(e) => !e.currentTarget.disabled && (e.currentTarget.style.background = "var(--np-surface-2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            Marquer « à contacter »
          </button>
          <button
            onClick={() => onStatusChange(bde.id, "partenariat signé")}
            disabled={bde.status === "partenariat signé"}
            className="w-full py-2 text-sm font-semibold rounded-lg transition-opacity disabled:opacity-30 hover:opacity-85"
            style={{ background: "var(--np-purple)", color: "white" }}
          >
            Partenariat signé ✓
          </button>
        </div>
      </aside>
    </>
  );
}
