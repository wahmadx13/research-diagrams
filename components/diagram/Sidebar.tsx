"use client";

import { useState } from "react";
import { Download, Menu, X } from "lucide-react";
import {
  DiagramData,
  DiagramConfig,
  SelectedArc,
  ArcData,
  ShapeType,
} from "@/types/diagram";
import { OuterLabelsEditor } from "./OuterLabelsEditor";
import { ArcConfigPanel } from "./ArcConfigPanel";
import { SidebarShapesDropdown } from "./SidebarShapesDropdown";
import { ShapeConfigPanel } from "./ShapeConfigPanel";
import { Slider } from "./Slider";

interface SidebarProps {
  data: DiagramData;
  config: DiagramConfig;
  selectedArc: SelectedArc | null;
  selectedShapeId: string | null;
  onSectorCountChange: (count: number) => void;
  onOuterLabelChange: (index: number, text: string) => void;
  onConfigChange: (updates: Partial<DiagramConfig>) => void;
  onAddLevel: () => void;
  onRemoveLevel: (id: string) => void;
  onArcUpdate: (
    levelIndex: number,
    sectorIndex: number,
    field: keyof ArcData,
    value: string
  ) => void;
  onDeselectArc: () => void;
  onAddShape: (type: ShapeType) => void;
  onShapeUpdate: (
    id: string,
    updates: Partial<import("@/types/diagram").ShapeData>
  ) => void;
  onShapeDelete: (id: string) => void;
  onDeselectShape: () => void;
  onDownloadPNG: () => void;
}

export function Sidebar({
  data,
  config,
  selectedArc,
  selectedShapeId,
  onSectorCountChange,
  onOuterLabelChange,
  onConfigChange,
  onAddLevel,
  onRemoveLevel,
  onArcUpdate,
  onDeselectArc,
  onAddShape,
  onShapeUpdate,
  onShapeDelete,
  onDeselectShape,
  onDownloadPNG,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden transition-opacity"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-white rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        aria-label="Toggle sidebar"
      >
        {isCollapsed ? <Menu size={20} /> : <X size={20} />}
      </button>
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 w-80 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 border-r border-gray-200/50 shadow-xl lg:shadow-sm transition-transform duration-300 ease-in-out ${
          isCollapsed ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col overflow-y-auto scrollbar-hide">
          <div className="p-6 pb-4 border-b border-gray-200/50">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Diagram Studio
            </h1>
          </div>
          <div className="space-y-6 flex-1 px-6 pb-6">
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm">
              <label className="text-xs font-semibold text-gray-700 mb-2 block">
                Sectors
              </label>
              <input
                type="number"
                value={data.sectors}
                onChange={(e) => onSectorCountChange(parseInt(e.target.value))}
                min="1"
                max="12"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <OuterLabelsEditor
              labels={data.outermostLabels}
              onLabelChange={onOuterLabelChange}
            />
            <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                Diagram Settings
              </h3>
              <Slider
                label="Arch Gap"
                value={config.arcPadding}
                min={2}
                max={100}
                onChange={(value) => onConfigChange({ arcPadding: value })}
                tooltip="Spacing between arc segments in pixels"
              />
              <Slider
                label="Ring Gap"
                value={config.gapSize}
                min={0}
                max={100}
                onChange={(value) => onConfigChange({ gapSize: value })}
                tooltip="Spacing between concentric rings"
              />
              <Slider
                label="Level Thickness"
                value={config.levelThickness}
                min={20}
                max={120}
                onChange={(value) => onConfigChange({ levelThickness: value })}
                tooltip="Thickness of each ring level"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onAddLevel}
                className="py-2.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg font-semibold text-sm hover:from-blue-600 hover:to-indigo-600 transition-all shadow-md hover:shadow-lg"
              >
                + Add Level
              </button>
              <button
                onClick={() => {
                  if (data.levels.length > 0) {
                    const lastLevel = data.levels[data.levels.length - 1];
                    onRemoveLevel(lastLevel.id);
                  }
                }}
                disabled={data.levels.length === 0}
                className="py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg font-semibold text-sm hover:from-red-600 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
              >
                Remove Level
              </button>
            </div>
            <SidebarShapesDropdown onAddShape={onAddShape} />
          </div>
          {selectedArc && (
            <div className="mt-6 px-6">
              <ArcConfigPanel
                selectedArc={selectedArc}
                arc={
                  data.levels[selectedArc.levelIndex].arcs[
                    selectedArc.sectorIndex
                  ]
                }
                onUpdate={onArcUpdate}
                onDeselect={onDeselectArc}
              />
            </div>
          )}
          {selectedShapeId &&
            (() => {
              const shape = data.shapes.find((s) => s.id === selectedShapeId);
              return shape ? (
                <div className="mt-6 px-6">
                  <ShapeConfigPanel
                    shape={shape}
                    onUpdate={(updates) =>
                      onShapeUpdate(selectedShapeId, updates)
                    }
                    onDelete={() => {
                      onShapeDelete(selectedShapeId);
                      onDeselectShape();
                    }}
                  />
                </div>
              ) : null;
            })()}
          <div className="px-6 pb-6">
            <button
              onClick={onDownloadPNG}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:from-indigo-700 hover:to-purple-700"
            >
              <Download size={20} /> Export PNG
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
