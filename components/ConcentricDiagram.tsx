"use client";

import { useRef, useState } from "react";
import { useDiagramData } from "@/hooks/useDiagramData";
import { useDownloadPNG } from "@/hooks/useDownloadPNG";
import { Sidebar } from "./diagram/Sidebar";
import { DiagramSVG } from "./diagram/DiagramSVG";
import { ShapeType, ShapeData } from "@/types/diagram";

export default function ConcentricDesigner() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const {
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
  } = useDiagramData();

  const downloadPNG = useDownloadPNG(svgRef);

  const handleArcSelect = (levelIndex: number, sectorIndex: number) => {
    setSelectedArc({ levelIndex, sectorIndex });
    setSelectedShapeId(null);
  };

  const handleDeselectArc = () => {
    setSelectedArc(null);
  };

  const handleAddShape = (type: ShapeType) => {
    const id = addShape(type);
    setSelectedShapeId(id);
    setSelectedArc(null);
  };

  const handleShapeSelect = (id: string) => {
    if (id) {
      setSelectedShapeId(id);
      setSelectedArc(null);
    } else {
      setSelectedShapeId(null);
    }
  };

  const handleShapeUpdate = (id: string, updates: Partial<ShapeData>) => {
    updateShape(id, updates);
  };

  const handleShapeDelete = (id: string) => {
    removeShape(id);
    setSelectedShapeId(null);
  };

  const handleDeselectShape = () => {
    setSelectedShapeId(null);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-100 via-purple-50 to-pink-50 overflow-hidden font-sans text-gray-900">
      <Sidebar
        data={data}
        config={config}
        selectedArc={selectedArc}
        selectedShapeId={selectedShapeId}
        onSectorCountChange={updateSectorCount}
        onOuterLabelChange={updateOuterLabel}
        onConfigChange={updateConfig}
        onAddLevel={addLevel}
        onRemoveLevel={removeLevel}
        onArcUpdate={updateArc}
        onDeselectArc={handleDeselectArc}
        onAddShape={handleAddShape}
        onShapeUpdate={handleShapeUpdate}
        onShapeDelete={handleShapeDelete}
        onDeselectShape={handleDeselectShape}
        onDownloadPNG={downloadPNG}
      />
      <div className="flex-1 flex items-center justify-center p-4 lg:p-10 overflow-auto scrollbar-hide">
        <DiagramSVG
          data={data}
          config={config}
          selectedShapeId={selectedShapeId}
          onArcSelect={handleArcSelect}
          onChannelTextChange={updateChannelText}
          onCenterTextChange={updateCenterText}
          onShapeSelect={handleShapeSelect}
          onShapeUpdate={handleShapeUpdate}
          onShapeDelete={handleShapeDelete}
          svgRef={svgRef}
        />
      </div>
    </div>
  );
}
