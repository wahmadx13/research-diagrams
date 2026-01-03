"use client";

import { useRef } from "react";
import { useDiagramData } from "@/hooks/useDiagramData";
import { useDownloadPNG } from "@/hooks/useDownloadPNG";
import { Sidebar } from "./diagram/Sidebar";
import { DiagramSVG } from "./diagram/DiagramSVG";

export default function ConcentricDesigner() {
  const svgRef = useRef<SVGSVGElement>(null);
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
  } = useDiagramData();

  const downloadPNG = useDownloadPNG(svgRef);

  const handleArcSelect = (levelIndex: number, sectorIndex: number) => {
    setSelectedArc({ levelIndex, sectorIndex });
  };

  const handleDeselectArc = () => {
    setSelectedArc(null);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      <Sidebar
        data={data}
        config={config}
        selectedArc={selectedArc}
        onSectorCountChange={updateSectorCount}
        onOuterLabelChange={updateOuterLabel}
        onConfigChange={updateConfig}
        onAddLevel={addLevel}
        onRemoveLevel={removeLevel}
        onArcUpdate={updateArc}
        onDeselectArc={handleDeselectArc}
        onDownloadPNG={downloadPNG}
      />
      <div className="flex-1 flex items-center justify-center p-10 overflow-auto">
        <DiagramSVG
          data={data}
          config={config}
          onArcSelect={handleArcSelect}
          onChannelTextChange={updateChannelText}
          onCenterTextChange={updateCenterText}
          svgRef={svgRef}
        />
      </div>
    </div>
  );
}
