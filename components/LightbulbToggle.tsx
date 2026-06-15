"use client";

import { useState } from "react";

interface LightbulbToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function LightbulbToggle({ isDark, onToggle }: LightbulbToggleProps) {
  const [swinging, setSwinging] = useState(false);

  function handleClick() {
    if (swinging) return;
    setSwinging(true);
    onToggle();
    setTimeout(() => setSwinging(false), 750);
  }

  // Light mode = bulb is ON (yellow/warm)
  // Dark mode  = bulb is OFF (cold grey)
  const on = !isDark;

  const dome      = on ? "#fde68a" : "#1e1e3a";
  const domeMid   = on ? "#fbbf24" : "#16163a";
  const domeEdge  = on ? "#f59e0b" : "#0f0f28";
  const base      = on ? "#b45309" : "#252545";
  const baseDark  = on ? "#92400e" : "#1a1a35";
  const filament  = on ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.15)";
  const wire      = on ? "#c4b5fd" : "#333355";
  const glowColor = on ? "rgba(251,191,36,0.55)" : "transparent";

  return (
    <button
      onClick={handleClick}
      aria-label={isDark ? "Passer en mode clair" : "Passer en mode sombre"}
      title={isDark ? "Mode clair" : "Mode sombre"}
      className={swinging ? "bulb-swing" : ""}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        transformOrigin: "top center",
        filter: on
          ? `drop-shadow(0 0 7px ${glowColor}) drop-shadow(0 0 18px ${glowColor})`
          : "none",
        transition: "filter 0.4s ease",
      }}
    >
      {/* Wire */}
      <div
        style={{
          width: 2,
          height: 24,
          background: wire,
          borderRadius: 1,
          transition: "background 0.4s",
        }}
      />

      {/* Bulb SVG */}
      <svg
        width="36"
        height="44"
        viewBox="0 0 36 46"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible" }}
      >
        <defs>
          <radialGradient id="domeGrad" cx="40%" cy="35%" r="60%">
            <stop offset="0%"   stopColor={dome} />
            <stop offset="55%"  stopColor={domeMid} />
            <stop offset="100%" stopColor={domeEdge} />
          </radialGradient>
          {on && (
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          )}
        </defs>

        {/* Outer glow halo (on only) */}
        {on && (
          <ellipse cx="18" cy="17" rx="16" ry="16"
            fill="rgba(251,191,36,0.14)"
          />
        )}

        {/* Glass dome — rounded teardrop */}
        <path
          d="M18 3 C9.72 3 3 9.72 3 18 C3 23.5 6.1 28.2 10.6 30.7 L11.5 34 H24.5 L25.4 30.7 C29.9 28.2 33 23.5 33 18 C33 9.72 26.28 3 18 3 Z"
          fill="url(#domeGrad)"
          style={{ transition: "fill 0.4s" }}
        />

        {/* Shine highlight */}
        <ellipse
          cx="12.5" cy="11"
          rx="3" ry="4.5"
          fill="white"
          opacity={on ? 0.28 : 0.06}
          transform="rotate(-20 12.5 11)"
          style={{ transition: "opacity 0.4s" }}
        />

        {/* Filament — M shape */}
        <path
          d="M13 26 L14.5 21 L16 25 L18 19 L20 25 L21.5 21 L23 26"
          stroke={filament}
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{ transition: "stroke 0.4s" }}
        />

        {/* Screw base — 3 bands */}
        <rect x="11" y="34" width="14" height="3"   rx="1.5" fill={base}    style={{ transition: "fill 0.4s" }} />
        <rect x="12" y="37" width="12" height="2.8" rx="1.4" fill={base}    opacity="0.85" style={{ transition: "fill 0.4s" }} />
        <rect x="13" y="40" width="10" height="2.8" rx="1.4" fill={baseDark} opacity="0.75" style={{ transition: "fill 0.4s" }} />

        {/* Contact tip */}
        <rect x="15.5" y="43" width="5" height="2.5" rx="1.2" fill={baseDark} style={{ transition: "fill 0.4s" }} />
      </svg>
    </button>
  );
}
