"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import type { Bde, BdeStatus } from "@/lib/types";
import { BdeTable, type SortKey, type SortDir } from "./BdeTable";
import { FilterBar } from "./FilterBar";
import { BdeDetail } from "./BdeDetail";
import { KpiCards } from "./KpiCards";
import { LightbulbToggle } from "./LightbulbToggle";
import { exportToCsv } from "@/lib/export";

export function BdeDashboard({ initialBdes }: { initialBdes: Bde[] }) {
  const [bdes, setBdes] = useState<Bde[]>(initialBdes);
  const [filters, setFilters] = useState({ city: "", school: "", search: "" });
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "score",
    dir: "desc",
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailBde, setDetailBde] = useState<Bde | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isDark]);

  const cities = useMemo(
    () => [...new Set(bdes.map((b) => b.city))].sort((a, b) => a.localeCompare(b, "fr")),
    [bdes]
  );
  const schools = useMemo(
    () => [...new Set(bdes.map((b) => b.school))].sort((a, b) => a.localeCompare(b, "fr")),
    [bdes]
  );

  const filtered = useMemo(() => {
    let result = bdes;
    if (filters.city) result = result.filter((b) => b.city === filters.city);
    if (filters.school) result = result.filter((b) => b.school === filters.school);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (b) => b.name.toLowerCase().includes(q) || b.school.toLowerCase().includes(q)
      );
    }
    return [...result].sort((a, b) => {
      const av = a[sort.key];
      const bv = b[sort.key];
      const cmp =
        typeof av === "number" && typeof bv === "number"
          ? av - bv
          : String(av).localeCompare(String(bv), "fr");
      return sort.dir === "asc" ? cmp : -cmp;
    });
  }, [bdes, filters, sort]);

  function handleSort(key: SortKey) {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: key === "score" || key === "followers" ? "desc" : "asc" }
    );
  }

  function handleSelectAll(ids: string[]) {
    const allSelected = ids.every((id) => selectedIds.has(id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (allSelected) ids.forEach((id) => next.delete(id));
      else ids.forEach((id) => next.add(id));
      return next;
    });
  }

  function handleSelectOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleStatusChange(id: string, status: BdeStatus) {
    setBdes((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    setDetailBde((prev) => (prev?.id === id ? { ...prev, status } : prev));
    await fetch(`/api/bdes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  function handleExport() {
    const toExport =
      selectedIds.size > 0 ? bdes.filter((b) => selectedIds.has(b.id)) : filtered;
    exportToCsv(toExport);
  }

  return (
    <div
      className="flex flex-col h-screen min-w-[1280px]"
      style={{ background: "var(--np-bg)" }}
    >
      {/* Header */}
      <header
        className="shrink-0 relative overflow-hidden"
        style={{
          background: "var(--np-header-bg)",
          borderBottom: "1px solid var(--np-border)",
          transition: "background 0.3s",
        }}
      >
        {/* Purple glow behind logo */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: -40,
            top: -60,
            width: 260,
            height: 180,
            background:
              "radial-gradient(ellipse at center, var(--np-header-glow) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div className="relative flex items-center gap-4 px-6 py-3">
          <Image
            src="/framelogo.webp"
            alt="NightPass"
            width={126}
            height={34}
            priority
            style={{ width: 126, height: "auto" }}
          />

          {/* Tagline */}
          <div className="flex flex-col justify-center leading-none ml-1">
            <span
              className="text-[13px] font-semibold italic tracking-wide"
              style={{
                background: "linear-gradient(90deg, #c4aff0 0%, #8b6ef3 50%, #6c47d4 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Sécurise ta soirée.
            </span>
          </div>

          {/* Right — badge + bulb */}
          <div className="ml-auto flex items-end gap-5">
            <span
              className="text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full self-center"
              style={{
                background: "var(--np-purple-dim)",
                color: "var(--np-purple-light)",
                border: "1px solid rgba(124,92,191,0.35)",
                letterSpacing: "0.12em",
                transition: "all 0.3s",
              }}
            >
              Dashboard BDE
            </span>

            {/* Hanging lightbulb */}
            <div style={{ marginBottom: -12 }}>
              <LightbulbToggle isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
            </div>
          </div>
        </div>

        {/* Bottom purple line */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, rgba(124,92,191,0.6) 0%, rgba(124,92,191,0.15) 40%, transparent 70%)",
          }}
        />
      </header>

      {/* KPI */}
      <KpiCards bdes={bdes} />

      {/* Filters */}
      <FilterBar
        cities={cities}
        schools={schools}
        filters={filters}
        onChange={setFilters}
        resultCount={filtered.length}
        selectedCount={selectedIds.size}
        onExport={handleExport}
      />

      {/* Table */}
      <div
        className="flex-1 overflow-hidden"
        style={{ background: "var(--np-bg)" }}
      >
        <BdeTable
          bdes={filtered}
          sort={sort}
          onSort={handleSort}
          selectedIds={selectedIds}
          onSelectAll={handleSelectAll}
          onSelectOne={handleSelectOne}
          onRowClick={setDetailBde}
          onStatusChange={handleStatusChange}
        />
      </div>

      {/* Drawer */}
      <BdeDetail
        bde={detailBde}
        onClose={() => setDetailBde(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
