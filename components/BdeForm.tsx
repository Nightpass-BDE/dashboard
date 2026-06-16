"use client";

import { useState } from "react";
import type { Bde } from "@/lib/types";

interface BdeFormProps {
  onClose: () => void;
  onCreated: (bde: Bde) => void;
}

const FIELDS = [
  { key: "name",      label: "Nom BDE",   required: true,  placeholder: "BDE KEDGE" },
  { key: "school",    label: "École",      required: true,  placeholder: "KEDGE Business School" },
  { key: "city",      label: "Ville",      required: true,  placeholder: "Bordeaux" },
  { key: "email",     label: "Email",      required: false, placeholder: "bde@ecole.fr" },
  { key: "phone",     label: "Téléphone",  required: false, placeholder: "+33 5 56 00 00 00" },
  { key: "instagram", label: "Instagram",  required: false, placeholder: "@bde_ecole" },
  { key: "website",   label: "Site web",   required: false, placeholder: "https://bde.ecole.fr" },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];

export function BdeForm({ onClose, onCreated }: BdeFormProps) {
  const [values, setValues] = useState<Record<FieldKey, string>>({
    name: "", school: "", city: "", email: "", phone: "", instagram: "", website: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function set(key: FieldKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/bdes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Erreur serveur");
      const bde: Bde = await res.json();
      onCreated(bde);
      onClose();
    } catch {
      setError("Impossible de créer le BDE. Réessayez.");
    } finally {
      setLoading(false);
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--np-surface-2)",
    border: "1px solid var(--np-border)",
    color: "var(--np-text)",
    borderRadius: "8px",
    padding: "8px 12px",
    fontSize: "13px",
    outline: "none",
    transition: "border-color 0.2s",
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50"
        style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(3px)" }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="fixed z-50 flex flex-col"
        style={{
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 480,
          maxHeight: "90vh",
          background: "var(--np-surface)",
          border: "1px solid var(--np-border)",
          borderRadius: "16px",
          boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: "1px solid var(--np-border)" }}
        >
          <div>
            <h2 className="text-base font-semibold" style={{ color: "var(--np-text)" }}>
              Nouveau BDE
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--np-text-muted)" }}>
              Les données du scraper seront ajoutées automatiquement
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg"
            style={{ color: "var(--np-text-muted)" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--np-surface-2)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-y-auto">
          <div className="px-6 py-5 space-y-4">
            {FIELDS.map(({ key, label, required, placeholder }) => (
              <div key={key}>
                <label
                  className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                  style={{ color: "var(--np-text-dim)" }}
                >
                  {label}
                  {required && (
                    <span style={{ color: "var(--np-purple-light)", marginLeft: 3 }}>*</span>
                  )}
                </label>
                <input
                  type="text"
                  value={values[key]}
                  onChange={(e) => set(key, e.target.value)}
                  placeholder={placeholder}
                  required={required}
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--np-purple)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--np-border)")}
                />
              </div>
            ))}

            {error && (
              <p className="text-xs px-3 py-2 rounded-lg" style={{ background: "#fef2f2", color: "#dc2626" }}>
                {error}
              </p>
            )}
          </div>

          {/* Footer */}
          <div
            className="flex gap-3 px-6 py-4 shrink-0"
            style={{ borderTop: "1px solid var(--np-border)" }}
          >
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 text-sm font-medium rounded-lg transition-opacity"
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
              type="submit"
              disabled={loading}
              className="flex-1 py-2 text-sm font-semibold rounded-lg transition-opacity disabled:opacity-50"
              style={{ background: "var(--np-purple)", color: "#fff" }}
            >
              {loading ? "Création…" : "Créer le BDE"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
