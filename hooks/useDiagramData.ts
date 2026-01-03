import { useState } from "react";
import {
  DiagramData,
  DiagramConfig,
  SelectedArc,
  ArcData,
  ShapeData,
  ShapeType,
} from "@/types/diagram";

const initialData: DiagramData = {
  centerText: "Center\nTopic",
  sectors: 4,
  levels: [
    {
      id: "lvl-1",
      arcs: [
        { text: "Option 1", color: "#e2e8f0", textColor: "#1e293b" },
        { text: "Option 2", color: "#e2e8f0", textColor: "#1e293b" },
        { text: "Option 3", color: "#e2e8f0", textColor: "#1e293b" },
        { text: "Option 4", color: "#e2e8f0", textColor: "#1e293b" },
      ],
    },
  ],
  channelTexts: {},
  outermostLabels: ["Label A", "Label B", "Label C", "Label D"],
  arrows: [],
  shapes: [],
};

const initialConfig: DiagramConfig = {
  gapSize: 20,
  levelThickness: 60,
  centerRadius: 70,
  arcPadding: 10,
};

export function useDiagramData() {
  const [data, setData] = useState<DiagramData>(initialData);
  const [config, setConfig] = useState<DiagramConfig>(initialConfig);
  const [selectedArc, setSelectedArc] = useState<SelectedArc | null>(null);

  const updateChannelText = (sectorIdx: number, text: string) => {
    setData((prev) => ({
      ...prev,
      channelTexts: { ...prev.channelTexts, [`channel-${sectorIdx}`]: text },
    }));
  };

  const updateOuterLabel = (sectorIdx: number, text: string) => {
    const newLabels = [...data.outermostLabels];
    newLabels[sectorIdx] = text;
    setData((prev) => ({ ...prev, outermostLabels: newLabels }));
  };

  const addLevel = () => {
    const newArcs = Array(data.sectors)
      .fill(null)
      .map(() => ({ text: "New", color: "#e2e8f0", textColor: "#333" }));
    setData((prev) => ({
      ...prev,
      levels: [...prev.levels, { id: `lvl-${Date.now()}`, arcs: newArcs }],
    }));
  };

  const removeLevel = (id: string) => {
    setData((prev) => ({
      ...prev,
      levels: prev.levels.filter((lvl) => lvl.id !== id),
    }));
    setSelectedArc(null);
  };

  const updateArc = (
    levelIndex: number,
    sectorIndex: number,
    field: keyof ArcData,
    value: string
  ) => {
    const newLevels = [...data.levels];
    newLevels[levelIndex].arcs[sectorIndex] = {
      ...newLevels[levelIndex].arcs[sectorIndex],
      [field]: value,
    };
    setData({ ...data, levels: newLevels });
  };

  const updateSectorCount = (count: number) => {
    const n = Math.max(1, Math.min(12, count));
    setData((prev) => {
      const newLabels = [...prev.outermostLabels];
      while (newLabels.length < n)
        newLabels.push(`Label ${newLabels.length + 1}`);
      return {
        ...prev,
        sectors: n,
        outermostLabels: newLabels.slice(0, n),
        levels: prev.levels.map((lvl) => ({
          ...lvl,
          arcs: Array(n)
            .fill(null)
            .map(
              (_, i) =>
                lvl.arcs[i] || {
                  text: "New",
                  color: "#e2e8f0",
                  textColor: "#333",
                }
            ),
        })),
      };
    });
  };

  const updateCenterText = (text: string) => {
    setData((prev) => ({ ...prev, centerText: text }));
  };

  const updateConfig = (updates: Partial<DiagramConfig>) => {
    setConfig((prev) => ({ ...prev, ...updates }));
  };

  const addShape = (type: ShapeType) => {
    const newShape: ShapeData = {
      id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      position: { x: 500, y: 500 },
      rotation: 0,
      size: { width: 100, height: 30 },
      color: "#3b82f6",
      ...(type === "double-curved" && { curveHeight: -15 }),
    };
    setData((prev) => ({
      ...prev,
      shapes: [...prev.shapes, newShape],
    }));
    return newShape.id;
  };

  const updateShape = (id: string, updates: Partial<ShapeData>) => {
    setData((prev) => ({
      ...prev,
      shapes: prev.shapes.map((shape) =>
        shape.id === id ? { ...shape, ...updates } : shape
      ),
    }));
  };

  const removeShape = (id: string) => {
    setData((prev) => ({
      ...prev,
      shapes: prev.shapes.filter((shape) => shape.id !== id),
    }));
  };

  return {
    data,
    config,
    selectedArc,
    setSelectedArc,
    updateChannelText,
    updateOuterLabel,
    addLevel,
    removeLevel,
    updateArc,
    updateSectorCount,
    updateCenterText,
    updateConfig,
    addShape,
    updateShape,
    removeShape,
  };
}
