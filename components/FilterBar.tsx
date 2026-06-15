"use client";

interface Filters {
  city: string;
  school: string;
  search: string;
}

interface FilterBarProps {
  cities: string[];
  schools: string[];
  filters: Filters;
  onChange: (filters: Filters) => void;
  resultCount: number;
  selectedCount: number;
  onExport: () => void;
}

const inputStyle: React.CSSProperties = {
  background: "var(--np-surface)",
  border: "1px solid var(--np-border)",
  color: "var(--np-text)",
  borderRadius: "8px",
  padding: "6px 12px",
  fontSize: "13px",
  outline: "none",
};

export function FilterBar({
  cities,
  schools,
  filters,
  onChange,
  resultCount,
  selectedCount,
  onExport,
}: FilterBarProps) {
  const activeFilters = [filters.city, filters.school, filters.search].filter(Boolean).length;

  return (
    <div
      className="flex items-center gap-3 px-4 py-2.5 shrink-0"
      style={{
        background: "var(--np-surface)",
        borderBottom: "1px solid var(--np-border)",
      }}
    >
      <input
        type="text"
        placeholder="Rechercher un BDE…"
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        style={{ ...inputStyle, width: "220px" }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--np-purple)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--np-border)")}
      />

      <select
        value={filters.city}
        onChange={(e) => onChange({ ...filters, city: e.target.value })}
        style={inputStyle}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--np-purple)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--np-border)")}
      >
        <option value="">Toutes les villes</option>
        {cities.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <select
        value={filters.school}
        onChange={(e) => onChange({ ...filters, school: e.target.value })}
        style={{ ...inputStyle, maxWidth: "220px" }}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--np-purple)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--np-border)")}
      >
        <option value="">Toutes les écoles</option>
        {schools.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>

      {activeFilters > 0 && (
        <button
          onClick={() => onChange({ city: "", school: "", search: "" })}
          className="text-xs underline"
          style={{ color: "var(--np-text-muted)" }}
        >
          Réinitialiser
        </button>
      )}

      <span className="ml-auto text-xs" style={{ color: "var(--np-text-muted)" }}>
        <span className="font-semibold" style={{ color: "var(--np-text)" }}>{resultCount}</span> BDE
        {selectedCount > 0 && (
          <>
            {" "}·{" "}
            <span style={{ color: "var(--np-purple-light)", fontWeight: 600 }}>
              {selectedCount} sélectionné{selectedCount > 1 ? "s" : ""}
            </span>
          </>
        )}
      </span>

      <button
        onClick={onExport}
        className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg font-medium transition-opacity hover:opacity-80"
        style={{ background: "var(--np-purple)", color: "#fff" }}
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {selectedCount > 0 ? `Exporter (${selectedCount})` : "Exporter tout"}
      </button>
    </div>
  );
}
