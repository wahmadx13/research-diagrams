import { Point } from "@/types/diagram";

export function getSVGPoint(
  svg: SVGSVGElement,
  clientX: number,
  clientY: number
): Point {
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const svgPoint = pt.matrixTransform(svg.getScreenCTM()?.inverse());
  return { x: svgPoint.x, y: svgPoint.y };
}

export function calculateDistance(p1: Point, p2: Point): number {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

export function calculateAngle(p1: Point, p2: Point): number {
  return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
}

export function rotatePoint(point: Point, center: Point, angle: number): Point {
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = point.x - center.x;
  const dy = point.y - center.y;
  return {
    x: center.x + dx * cos - dy * sin,
    y: center.y + dx * sin + dy * cos,
  };
}

export function createStraightArrowPath(
  width: number,
  height: number,
  double: boolean
): string {
  const arrowHeadSize = height * 0.4;
  const startX = 0;
  const endX = width;
  const midY = height / 2;

  if (double) {
    return `M ${startX} ${midY} L ${arrowHeadSize} ${midY - arrowHeadSize / 2} M ${startX} ${midY} L ${arrowHeadSize} ${midY + arrowHeadSize / 2} M ${arrowHeadSize} ${midY} L ${endX - arrowHeadSize} ${midY} M ${endX} ${midY} L ${endX - arrowHeadSize} ${midY - arrowHeadSize / 2} M ${endX} ${midY} L ${endX - arrowHeadSize} ${midY + arrowHeadSize / 2}`;
  }

  return `M ${startX} ${midY} L ${endX - arrowHeadSize} ${midY} L ${endX - arrowHeadSize} ${midY - arrowHeadSize / 2} M ${endX - arrowHeadSize} ${midY} L ${endX - arrowHeadSize} ${midY + arrowHeadSize / 2} L ${endX} ${midY}`;
}

export function createCurvedArrowPath(
  width: number,
  height: number,
  double: boolean
): string {
  const arrowHeadSize = height * 0.4;
  const controlOffset = width * 0.3;
  const startX = 0;
  const endX = width;
  const midY = height / 2;

  const path = `M ${startX} ${midY} Q ${startX + controlOffset} ${midY - controlOffset} ${endX - arrowHeadSize} ${midY}`;

  const arrowHead = `L ${endX - arrowHeadSize} ${midY - arrowHeadSize / 2} M ${endX - arrowHeadSize} ${midY} L ${endX - arrowHeadSize} ${midY + arrowHeadSize / 2} L ${endX} ${midY}`;

  if (double) {
    const reversePath = `M ${endX} ${midY} Q ${endX - controlOffset} ${midY + controlOffset} ${startX + arrowHeadSize} ${midY}`;
    const reverseArrowHead = `L ${startX + arrowHeadSize} ${midY - arrowHeadSize / 2} M ${startX + arrowHeadSize} ${midY} L ${startX + arrowHeadSize} ${midY + arrowHeadSize / 2} L ${startX} ${midY}`;
    return `${path} ${arrowHead} ${reversePath} ${reverseArrowHead}`;
  }

  return `${path} ${arrowHead}`;
}

