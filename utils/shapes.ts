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
  const arrowHeadLength = Math.min(width * 0.15, height * 0.6);
  const arrowHeadWidth = height * 0.5;
  const startX = 0;
  const endX = width;
  const midY = height / 2;
  const shaftEndX = endX - arrowHeadLength;

  if (double) {
    const leftShaftStartX = arrowHeadLength;
    const leftHeadTipX = 0;
    const rightHeadTipX = endX;
    const rightShaftEndX = endX - arrowHeadLength;

    return `M ${leftShaftStartX} ${midY} L ${rightShaftEndX} ${midY} M ${rightHeadTipX} ${midY} L ${rightShaftEndX} ${
      midY - arrowHeadWidth / 2
    } M ${rightHeadTipX} ${midY} L ${rightShaftEndX} ${
      midY + arrowHeadWidth / 2
    } M ${leftHeadTipX} ${midY} L ${leftShaftStartX} ${
      midY - arrowHeadWidth / 2
    } M ${leftHeadTipX} ${midY} L ${leftShaftStartX} ${
      midY + arrowHeadWidth / 2
    }`;
  }

  return `M ${startX} ${midY} L ${shaftEndX} ${midY} M ${endX} ${midY} L ${shaftEndX} ${
    midY - arrowHeadWidth / 2
  } M ${endX} ${midY} L ${shaftEndX} ${midY + arrowHeadWidth / 2}`;
}

export function createCurvedArrowPath(
  width: number,
  height: number,
  double: boolean
): string {
  const arrowHeadLength = Math.min(width * 0.12, height * 0.5);
  const arrowHeadWidth = height * 0.5;
  const curveHeight = height * 0.6;
  const startX = 0;
  const endX = width;
  const midY = height / 2;
  const controlX1 = width * 0.25;
  const controlX2 = width * 0.75;
  const controlY1 = midY - curveHeight;
  const controlY2 = midY - curveHeight;
  const shaftEndX = endX - arrowHeadLength;

  const mainPath = `M ${startX} ${midY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${shaftEndX} ${midY}`;
  const arrowHead = `M ${endX} ${midY} L ${shaftEndX} ${
    midY - arrowHeadWidth / 2
  } M ${endX} ${midY} L ${shaftEndX} ${midY + arrowHeadWidth / 2}`;

  if (double) {
    const reverseControlX1 = width * 0.75;
    const reverseControlX2 = width * 0.25;
    const reverseControlY1 = midY + curveHeight;
    const reverseControlY2 = midY + curveHeight;
    const reverseShaftStartX = startX + arrowHeadLength;
    const reversePath = `M ${endX} ${midY} C ${reverseControlX1} ${reverseControlY1}, ${reverseControlX2} ${reverseControlY2}, ${reverseShaftStartX} ${midY}`;
    const reverseArrowHead = `M ${startX} ${midY} L ${reverseShaftStartX} ${
      midY - arrowHeadWidth / 2
    } M ${startX} ${midY} L ${reverseShaftStartX} ${midY + arrowHeadWidth / 2}`;
    return `${mainPath} ${arrowHead} ${reversePath} ${reverseArrowHead}`;
  }

  return `${mainPath} ${arrowHead}`;
}
