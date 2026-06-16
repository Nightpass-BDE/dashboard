"use client";

import { useState, useEffect } from "react";
import type { Bde, BdeStatus } from "@/lib/types";
import { ScoreBadge } from "./ScoreBadge";
import { StatusBadge } from "./StatusBadge";

interface BdeDetailProps {
  bde: Bde | null;
  onClose: () => void;
  onStatusChange: (id: string, status: BdeStatus) => void;
  onBdeUpdate: (bde: Bde) => void;
  startInEditMode?: boolean;
}

type DraftFields = {
  name: string;
  school: string;
  city: string;
  email: string;
  phone: string;
  instagram: string;
  website: string;
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "var(--np-surface-2)",
  border: "1px solid var(--np-border)",
  color: "var(--np-text)",
  borderRadius: "8px",
  padding: "6px 10px",
  fontSize: "13px",
  outline: "none",
  transition: "border-color 0.2s",
};

export function BdeDetail({ bde, onClose, onStatusChange, onBdeUpdate, startInEditMode }: BdeDetailProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<DraftFields | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (bde) {
      setEditing(!!startInEditMode);
      setDraft({
        name: bde.name,
        school: bde.school,
        city: bde.city,
        email: bde.email ?? "",
        phone: bde.phone ?? "",
        instagram: bde.instagram ?? "",
        website: bde.website ?? "",
      });
    }
  }, [bde?.id, startInEditMode]);

  if (!bde || !draft) return null;

  const instagramUrl = bde.instagram.startsWith("http")
    ? bde.instagram
    : `https://instagram.com/${bde.instagram.replace(/^@/, "")}`;

  function set(key: keyof DraftFields, value: string) {
    setDraft((prev) => prev ? { ...prev, [key]: value } : prev);
  }

  function cancelEdit() {
    if (!bde) return;
    setDraft({
      name: bde.name,
      school: bde.school,
      city: bde.city,
      email: bde.email ?? "",
      phone: bde.phone ?? "",
      instagram: bde.instagram ?? "",
      website: bde.website ?? "",
    });
    setEditing(false);
  }

  async function saveEdit() {
    if (!bde || !draft) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/bdes/${bde.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: draft.name,
          school: draft.school,
          city: draft.city,
          email: draft.email || null,
          phone: draft.phone || null,
          instagram: draft.instagram || null,
          website: draft.website || null,
        }),
      });
      if (!res.ok) throw new Error();
      const updated: Bde = await res.json();
      onBdeUpdate(updated);
      setEditing(false);
    } catch {
      // keep editing open on error
    } finally {
      setSaving(false);
    }
  }

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
          <div className="flex-1 min-w-0 mr-3">
            {editing ? (
              <>
                <input
                  value={draft.name}
                  onChange={(e) => set("name", e.target.value)}
                  style={{ ...inputStyle, fontSize: "15px", fontWeight: 600, marginBottom: 6 }}
                  placeholder="Nom BDE"
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--np-purple)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--np-border)")}
                />
                <input
                  value={draft.school}
                  onChange={(e) => set("school", e.target.value)}
                  style={{ ...inputStyle, fontSize: "13px" }}
                  placeholder="École"
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--np-purple)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--np-border)")}
                />
              </>
            ) : (
              <>
                <h2 className="text-base font-semibold truncate" style={{ color: "var(--np-text)" }}>{bde.name}</h2>
                <p className="text-sm mt-0.5 truncate" style={{ color: "var(--np-text-muted)" }}>{bde.school}</p>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                title="Modifier"
                className="p-1.5 rounded-lg transition-colors"
                style={{ background: "none", border: "none", cursor: "pointer", opacity: 0.5, transition: "opacity 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.5")}
              >
                <img src="/ecrivez.png" alt="Modifier" width={16} height={16} className="np-icon-edit" style={{ display: "block" }} />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg transition-colors"
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
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Score + status + instagram activity */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "var(--np-text-muted)" }}>Score</span>
              <ScoreBadge score={bde.score} />
            </div>
            <div style={{ width: 1, height: 16, background: "var(--np-border)" }} />
            <StatusBadge status={bde.status} />
            <div style={{ width: 1, height: 16, background: "var(--np-border)" }} />
            <div className="flex items-center gap-1.5">
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: bde.instagramActive ? "#22c55e" : "#6b6b80",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span className="text-xs" style={{ color: bde.instagramActive ? "#22c55e" : "var(--np-text-muted)" }}>
                {bde.instagramActive ? "Actif" : "Inactif"}
              </span>
              {bde.lastPostDate && (
                <span className="text-xs" style={{ color: "var(--np-text-dim)" }}>
                  · dernier post {bde.lastPostDate}
                </span>
              )}
            </div>
          </div>

          {/* Info grid */}
          {editing ? (
            <div className="space-y-4">
              {[
                { key: "city" as const, label: "Ville", placeholder: "Paris" },
                { key: "email" as const, label: "Email", placeholder: "bde@ecole.fr" },
                { key: "phone" as const, label: "Téléphone", placeholder: "+33 1 00 00 00 00" },
                { key: "instagram" as const, label: "Instagram", placeholder: "@bde_ecole" },
                { key: "website" as const, label: "Site web", placeholder: "https://bde.ecole.fr" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label
                    className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                    style={{ color: "var(--np-text-dim)" }}
                  >
                    {label}
                  </label>
                  <input
                    value={draft[key]}
                    onChange={(e) => set(key, e.target.value)}
                    placeholder={placeholder}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--np-purple)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--np-border)")}
                  />
                </div>
              ))}
            </div>
          ) : (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--np-text-dim)" }}>Ville</dt>
                <dd className="text-sm mt-0.5" style={{ color: "var(--np-text)" }}>{bde.city}</dd>
              </div>

              <div>
                <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--np-text-dim)" }}>Abonnés Instagram</dt>
                <dd className="text-sm mt-0.5 tabular-nums" style={{ color: "var(--np-text)" }}>{bde.followers.toLocaleString("fr-FR")}</dd>
              </div>

              <div className="col-span-2">
                <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--np-text-dim)" }}>Email</dt>
                <dd className="mt-0.5">
                  {bde.email ? (
                    <a href={`mailto:${bde.email}`} className="text-sm hover:underline" style={{ color: "var(--np-purple-light)" }}>
                      {bde.email}
                    </a>
                  ) : (
                    <span className="text-sm italic" style={{ color: "var(--np-text-dim)" }}>—</span>
                  )}
                </dd>
              </div>

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

              <div>
                <dt className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--np-text-dim)" }}>Instagram</dt>
                <dd className="mt-0.5">
                  {bde.instagram ? (
                    <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="text-sm hover:underline" style={{ color: "var(--np-purple-light)" }}>
                      {bde.instagram}
                    </a>
                  ) : (
                    <span className="text-sm italic" style={{ color: "var(--np-text-dim)" }}>—</span>
                  )}
                </dd>
              </div>

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
          )}

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
          {editing ? (
            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelEdit}
                className="flex-1 py-2 text-sm font-medium rounded-lg"
                style={{
                  border: "1px solid var(--np-border)",
                  color: "var(--np-text-muted)",
                  background: "transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--np-surface-2)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={saveEdit}
                disabled={saving}
                className="flex-1 py-2 text-sm font-semibold rounded-lg disabled:opacity-50"
                style={{ background: "var(--np-purple)", color: "#fff" }}
              >
                {saving ? "Sauvegarde…" : "Sauvegarder"}
              </button>
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </aside>
    </>
  );
}
