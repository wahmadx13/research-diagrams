"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { ShapeData, Point } from "@/types/diagram";
import { ArrowShape } from "./ArrowShape";
import { getSVGPoint, calculateDistance, calculateAngle } from "@/utils/shapes";

interface DraggableShapeProps {
  shape: ShapeData;
  isSelected: boolean;
  svgRef: React.RefObject<SVGSVGElement | null>;
  onSelect: () => void;
  onUpdate: (updates: Partial<ShapeData>) => void;
  onDelete: () => void;
}

const HANDLE_SIZE = 8;
const ROTATE_HANDLE_DISTANCE = 30;

export function DraggableShape({
  shape,
  isSelected,
  svgRef,
  onSelect,
  onUpdate,
  onDelete,
}: DraggableShapeProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const dragStartRef = useRef<Point | null>(null);
  const initialShapeRef = useRef<ShapeData | null>(null);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (!svgRef.current) return;
      e.stopPropagation();
      const svgPoint = getSVGPoint(svgRef.current, e.clientX, e.clientY);
      dragStartRef.current = svgPoint;
      initialShapeRef.current = { ...shape };
      setIsDragging(true);
      onSelect();
    },
    [shape, svgRef, onSelect]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!svgRef.current || !dragStartRef.current || !initialShapeRef.current)
        return;

      e.preventDefault();
      const svgPoint = getSVGPoint(svgRef.current, e.clientX, e.clientY);

      if (isRotating) {
        const center = initialShapeRef.current.position;
        const initialAngle = calculateAngle(center, dragStartRef.current);
        const currentAngle = calculateAngle(center, svgPoint);
        const rotationDelta = currentAngle - initialAngle;
        const newRotation = initialShapeRef.current.rotation + rotationDelta;
        onUpdate({ rotation: newRotation });
      } else if (isResizing) {
        const center = initialShapeRef.current.position;
        const initialDistance = calculateDistance(center, dragStartRef.current);
        const currentDistance = calculateDistance(center, svgPoint);
        const scale = currentDistance / initialDistance;
        const newWidth = Math.max(
          50,
          initialShapeRef.current.size.width * scale
        );
        const newHeight = Math.max(
          20,
          initialShapeRef.current.size.height * scale
        );
        const updates: Partial<ShapeData> = {
          size: { width: newWidth, height: newHeight },
        };
        if (
          initialShapeRef.current.type === "single-curved" ||
          initialShapeRef.current.type === "double-curved"
        ) {
          const heightScale = newHeight / initialShapeRef.current.size.height;
          const currentCurveAmount =
            initialShapeRef.current.curveAmount ??
            -initialShapeRef.current.size.height * 0.5;
          updates.curveAmount = currentCurveAmount * heightScale;
        }
        onUpdate(updates);
      } else if (isDragging) {
        const dx = svgPoint.x - dragStartRef.current.x;
        const dy = svgPoint.y - dragStartRef.current.y;
        onUpdate({
          position: {
            x: initialShapeRef.current.position.x + dx,
            y: initialShapeRef.current.position.y + dy,
          },
        });
      }
    },
    [isDragging, isResizing, isRotating, onUpdate, svgRef]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsResizing(false);
    setIsRotating(false);
    dragStartRef.current = null;
    initialShapeRef.current = null;
  }, []);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!svgRef.current) return;
      const svgPoint = getSVGPoint(svgRef.current, e.clientX, e.clientY);
      dragStartRef.current = svgPoint;
      initialShapeRef.current = { ...shape };
      setIsResizing(true);
      onSelect();
    },
    [shape, svgRef, onSelect]
  );

  const handleRotateStart = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!svgRef.current) return;
      const svgPoint = getSVGPoint(svgRef.current, e.clientX, e.clientY);
      dragStartRef.current = svgPoint;
      initialShapeRef.current = { ...shape };
      setIsRotating(true);
      onSelect();
    },
    [shape, svgRef, onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") {
        onDelete();
      }
    },
    [onDelete]
  );

  useEffect(() => {
    if (isDragging || isResizing || isRotating) {
      const handleMove = (e: MouseEvent) => {
        e.preventDefault();
        handleMouseMove(e);
      };
      window.addEventListener("mousemove", handleMove, { passive: false });
      window.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = isDragging
        ? "grabbing"
        : isResizing
        ? "nwse-resize"
        : "grab";
      document.body.style.userSelect = "none";
      return () => {
        window.removeEventListener("mousemove", handleMove);
        window.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isDragging, isResizing, isRotating, handleMouseMove, handleMouseUp]);

  const rotateHandleX = 0;
  const rotateHandleY = -shape.size.height / 2 - ROTATE_HANDLE_DISTANCE;

  const resizeHandleX = shape.size.width / 2;
  const resizeHandleY = 0;

  return (
    <g
      transform={`translate(${shape.position.x}, ${shape.position.y}) rotate(${shape.rotation})`}
      onMouseDown={handleMouseDown}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      style={{ outline: "none" }}
    >
      <g
        transform={`translate(${-shape.size.width / 2}, ${
          -shape.size.height / 2
        })`}
      >
        <ArrowShape shape={shape} />
      </g>

      {isSelected && (
        <>
          <rect
            x={-shape.size.width / 2 - 2}
            y={-shape.size.height / 2 - 2}
            width={shape.size.width + 4}
            height={shape.size.height + 4}
            fill="none"
            stroke="#3b82f6"
            strokeWidth={1}
            strokeDasharray="4 4"
            pointerEvents="none"
          />

          <circle
            cx={resizeHandleX}
            cy={resizeHandleY}
            r={HANDLE_SIZE / 2}
            fill="#3b82f6"
            stroke="white"
            strokeWidth={1}
            cursor="nwse-resize"
            onMouseDown={handleResizeStart}
            style={{ pointerEvents: "all" }}
          />

          <circle
            cx={rotateHandleX}
            cy={rotateHandleY}
            r={HANDLE_SIZE / 2}
            fill="#10b981"
            stroke="white"
            strokeWidth={1}
            cursor="grab"
            onMouseDown={handleRotateStart}
            style={{ pointerEvents: "all" }}
          />

          <line
            x1={0}
            y1={-shape.size.height / 2 - 5}
            x2={rotateHandleX}
            y2={rotateHandleY}
            stroke="#10b981"
            strokeWidth={1}
            strokeDasharray="2 2"
            pointerEvents="none"
          />
        </>
      )}
    </g>
  );
}
