// utils/geometry.ts

export interface Point {
  x: number;
  y: number;
}

export interface ArcPath {
  d: string;
  reversed: boolean;
}

/**
 * Converts polar coordinates to cartesian (x,y)
 */
export function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
): Point {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

/**
 * Creates a standard SVG path definition for an arc
 */
export function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    "M", start.x, start.y,
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(" ");
}

/**
 * Creates a text path that automatically flips direction if in the bottom hemisphere
 * to prevent upside-down text.
 */
export function describeTextArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
): ArcPath {
  // Normalize angles to 0-360 range for quadrant checking
  const midAngle = (startAngle + endAngle) / 2;
  const normalizedMid = (midAngle % 360 + 360) % 360;

  // Check if we are in the bottom hemisphere (roughly 90 to 270 degrees)
  const isBottomHalf = normalizedMid > 90 && normalizedMid < 270;

  if (isBottomHalf) {
    // Reverse path: Draw Counter-Clockwise (start -> end)
    const start = polarToCartesian(x, y, radius, startAngle);
    const end = polarToCartesian(x, y, radius, endAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    // Sweep flag '1' for counter-clockwise in this coord system context
    return {
      d: ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y].join(" "),
      reversed: true
    };
  } else {
    // Standard path: Draw Clockwise (end -> start)
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return {
      d: ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" "),
      reversed: false
    };
  }
}