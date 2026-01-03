import React, { useId } from "react";

interface SingleCurvedArrowProps {
  width: number;
  height: number;
  color?: string;
  strokeWidth?: number;
  curveAmount?: number; // Optional: Control how deep the curve is
}

export function SingleCurvedArrow({
  width,
  height,
  color = "#000",
  strokeWidth = 2,
  curveAmount,
}: SingleCurvedArrowProps) {
  const id = useId();
  const markerId = `arrowhead-${id}`;

  // Padding ensures the stroke/arrowhead doesn't get cut off by the SVG box
  const padding = 15;
  const effectiveWidth = width - padding * 2;

  // Calculate curve depth
  const curveDepth = curveAmount ?? height * 0.6; // Default to 60% of height if not specified

  // Path points
  const startX = padding;
  const startY = height / 2 + curveDepth * 0.2; // Start slightly lower/higher depending on curve
  const endX = width - padding;
  const endY = height / 2 + curveDepth * 0.2;

  // Control point for Quadratic Bezier (Q)
  const controlX = width / 2;
  const controlY = height / 2 - curveDepth;

  const path = `M ${startX} ${startY} Q ${controlX} ${controlY} ${endX} ${endY}`;

  return (
    <svg width={width} height={height} style={{ overflow: "visible" }}>
      <defs>
        <marker
          id={markerId}
          markerWidth="12"
          markerHeight="12"
          refX="10" // Adjusts where the line connects to the arrow (tip)
          refY="6"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          {/* A premium 'swept back' arrow shape */}
          <path d="M0,0 L12,6 L0,12 L3,6 Z" fill={color} />
        </marker>
      </defs>

      <path
        d={path}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        markerEnd={`url(#${markerId})`} // Attaches the marker to the end
      />
    </svg>
  );
}
