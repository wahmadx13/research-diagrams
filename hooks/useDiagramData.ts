import { useState } from "react";
import {
  DiagramData,
  DiagramConfig,
  SelectedArc,
  ArcData,
  ShapeData,
  ShapeType,
} from "@/types/diagram";

const vibrantColors = [
  { bg: "#3b82f6", text: "#ffffff" },
  { bg: "#10b981", text: "#064e3b" },
  { bg: "#f59e0b", text: "#78350f" },
  { bg: "#ef4444", text: "#7f1d1d" },
  { bg: "#8b5cf6", text: "#ffffff" },
  { bg: "#ec4899", text: "#831843" },
  { bg: "#06b6d4", text: "#164e63" },
  { bg: "#84cc16", text: "#365314" },
  { bg: "#f97316", text: "#7c2d12" },
  { bg: "#6366f1", text: "#ffffff" },
  { bg: "#14b8a6", text: "#134e4a" },
  { bg: "#a855f7", text: "#ffffff" },
];

const getColorForIndex = (index: number) => {
  return vibrantColors[index % vibrantColors.length];
};

const initialData: DiagramData = {
  centerText: "Center\nTopic",
  sectors: 4,
  levels: [
    {
      id: "lvl-1",
      arcs: [
        {
          text: "Option 1",
          color: "oklch(44.3% 0.11 240.79)",
          textColor: "oklch(76.9% 0.188 70.08)",
        },
        {
          text: "Option 2",
          color: "#10b981",
          textColor: "oklch(27.8% 0.033 256.848)",
        },
        {
          text: "Option 3",
          color: "#f59e0b",
          textColor: "oklch(62.7% 0.265 303.9)",
        },
        {
          text: "Option 4",
          color: "#ef4444",
          textColor: "oklch(78.5% 0.115 274.713)",
        },
      ],
    },
  ],
  channelTexts: {},
  outermostLabels: ["Label A", "Label B", "Label C", "Label D"],
  arrows: [],
  shapes: [],
};

const initialConfig: DiagramConfig = {
  gapSize: 40,
  levelThickness: 90,
  centerRadius: 100,
  arcPadding: 50,
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
      .map((_, idx) => {
        const colorPair = getColorForIndex(idx);
        return { text: "New", color: colorPair.bg, textColor: colorPair.text };
      });
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
            .map((_, i) => {
              const colorPair = getColorForIndex(i);
              return (
                lvl.arcs[i] || {
                  text: "New",
                  color: colorPair.bg,
                  textColor: colorPair.text,
                }
              );
            }),
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
    const offsetX = 200;
    const offsetY = 150;
    const initialHeight = 40;
    const newShape: ShapeData = {
      id: `shape-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      position: { x: offsetX, y: offsetY },
      rotation: 0,
      size: { width: 120, height: initialHeight },
      color: "#6366f1",
      ...((type === "single-curved" || type === "double-curved") && {
        curveAmount: -initialHeight * 0.5,
      }),
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
