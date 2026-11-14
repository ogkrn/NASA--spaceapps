"use client";

import React from "react";
import { CandidateSite } from "@/lib/types";

interface RadarComparisonProps {
  site: CandidateSite;
}

export const RadarComparison: React.FC<RadarComparisonProps> = ({ site }) => {
  const isMoon = site.body === "Moon";

  // Derive normalized scores (0 to 100)
  const thermalDelta = Math.abs(site.thermal_max_k - site.thermal_min_k);
  const thermalStability = Math.round(Math.max(5, 100 - thermalDelta / 2.5));
  const trafficability = Math.round(Math.max(5, 100 - site.slope_degrees * 4.5));

  const criteria = [
    { label: "Solar Power", value: site.solar_illumination_pct },
    { label: "Water Ice", value: site.water_ice_probability_pct },
    { label: "Trafficability", value: trafficability },
    { label: "Earth Comm", value: site.earth_visibility_pct },
    { label: "Rad Shield", value: site.natural_radiation_shielding_pct },
    { label: "Thermal Stability", value: thermalStability },
  ];

  const size = 300;
  const center = size / 2;
  const radius = 100;
  const totalAxes = criteria.length;

  const getCoordinates = (valuePct: number, axisIndex: number) => {
    const angle = (Math.PI * 2 / totalAxes) * axisIndex - Math.PI / 2;
    const r = (valuePct / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Generate polygon points
  const polygonPoints = criteria
    .map((c, i) => {
      const { x, y } = getCoordinates(c.value, i);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="w-full flex flex-col items-center justify-center p-4">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background concentric reference rings (25%, 50%, 75%, 100%) */}
        {[25, 50, 75, 100].map((level) => (
          <polygon
            key={level}
            points={criteria
              .map((_, i) => {
                const { x, y } = getCoordinates(level, i);
                return `${x},${y}`;
              })
              .join(" ")}
            fill="none"
            stroke="rgba(148, 163, 184, 0.15)"
            strokeWidth="1"
            strokeDasharray={level === 100 ? undefined : "3 3"}
          />
        ))}

        {/* Radial Axis Lines */}
        {criteria.map((_, i) => {
          const { x, y } = getCoordinates(100, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="rgba(148, 163, 184, 0.2)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon */}
        <polygon
          points={polygonPoints}
          fill={isMoon ? "rgba(34, 211, 238, 0.25)" : "rgba(249, 115, 22, 0.25)"}
          stroke={isMoon ? "#22d3ee" : "#f97316"}
          strokeWidth="2.5"
        />

        {/* Data Points */}
        {criteria.map((c, i) => {
          const { x, y } = getCoordinates(c.value, i);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4.5"
              fill={isMoon ? "#0891b2" : "#ea580c"}
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Axis Labels */}
        {criteria.map((c, i) => {
          const { x, y } = getCoordinates(120, i);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#cbd5e1"
              fontSize="11"
              fontFamily="monospace"
              className="font-medium"
            >
              {c.label} ({Math.round(c.value)}%)
            </text>
          );
        })}
      </svg>
    </div>
  );
};

