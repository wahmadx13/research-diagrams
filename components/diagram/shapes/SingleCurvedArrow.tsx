import React, { useId } from "react";

interface SingleCurvedArrowProps {
  width: number;
  height: number;
  color?: string;
  strokeWidth?: number;
  curveAmount?: number;
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

  const padding = 15;

  const curveDepth = curveAmount ?? height * 0.6;

  const startX = padding;
  const startY = height / 2 + curveDepth * 0.2;
  const endX = width - padding;
  const endY = height / 2 + curveDepth * 0.2;

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
          refX="10"
          refY="6"
          orient="auto"
          markerUnits="userSpaceOnUse"
        >
          <path d="M0,0 L12,6 L0,12 L3,6 Z" fill={color} />
        </marker>
      </defs>

      <path
        d={path}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        markerEnd={`url(#${markerId})`}
      />
    </svg>
  );
}
