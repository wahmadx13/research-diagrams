import { useState, useCallback } from "react";
import { ShapeData, ShapeType, Point, CENTER } from "@/types/diagram";

const DEFAULT_SHAPE_SIZE = { width: 100, height: 30 };
const DEFAULT_COLOR = "#3b82f6";

export function useShapes() {
  const [shapes, setShapes] = useState<ShapeData[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  const addShape = useCallback((type: ShapeType, position?: Point) => {
    const newShape: ShapeData = {
      id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      position: position || { x: CENTER, y: CENTER },
      rotation: 0,
      size: DEFAULT_SHAPE_SIZE,
      color: DEFAULT_COLOR,
    };
    setShapes((prev) => [...prev, newShape]);
    setSelectedShapeId(newShape.id);
    return newShape.id;
  }, []);

  const updateShape = useCallback((id: string, updates: Partial<ShapeData>) => {
    setShapes((prev) =>
      prev.map((shape) => (shape.id === id ? { ...shape, ...updates } : shape))
    );
  }, []);

  const removeShape = useCallback(
    (id: string) => {
      setShapes((prev) => prev.filter((shape) => shape.id !== id));
      if (selectedShapeId === id) {
        setSelectedShapeId(null);
      }
    },
    [selectedShapeId]
  );

  const bringToFront = useCallback((id: string) => {
    setShapes((prev) => {
      const shape = prev.find((s) => s.id === id);
      if (!shape) return prev;
      const others = prev.filter((s) => s.id !== id);
      return [...others, shape];
    });
  }, []);

  const selectShape = useCallback((id: string | null) => {
    setSelectedShapeId(id);
  }, []);

  return {
    shapes,
    selectedShapeId,
    addShape,
    updateShape,
    removeShape,
    bringToFront,
    selectShape,
  };
}
