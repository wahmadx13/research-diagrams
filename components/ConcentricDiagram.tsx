"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Download, Plus, Trash2, type LucideIcon } from "lucide-react";

// --- GEOMETRY UTILS ---
const polarToCartesian = (
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

const describeTextArc = (
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number
) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return {
    d: [
      "M",
      start.x,
      start.y,
      "A",
      radius,
      radius,
      0,
      largeArcFlag,
      0,
      end.x,
      end.y,
    ].join(" "),
  };
};

// --- TYPES ---
export type ArrowType = "single" | "double" | "curved";
export interface ArcData {
  text: string;
  color: string;
  textColor: string;
}
export interface LevelData {
  id: string;
  arcs: ArcData[];
}
export interface ArrowData {
  id: number;
  type: ArrowType;
  startAngle: number;
  endAngle: number;
  radius: number;
  color: string;
  offsetX: number;
  offsetY: number;
}

const SVG_SIZE = 1000;
const CENTER = SVG_SIZE / 2;

export default function ConcentricDesigner() {
  // --- STATE ---
  const [data, setData] = useState({
    centerText: "Center\nTopic",
    sectors: 3,
    levels: [
      {
        id: "lvl-1",
        arcs: [
          { text: "Option 1", color: "#e2e8f0", textColor: "#1e293b" },
          { text: "Option 2", color: "#e2e8f0", textColor: "#1e293b" },
          { text: "Option 3", color: "#e2e8f0", textColor: "#1e293b" },
        ],
      },
    ],
    channelTexts: {} as Record<string, string>,
    // New state to store labels that follow the outermost arch
    outermostLabels: ["Label A", "Label B", "Label C"] as string[],
    arrows: [] as ArrowData[],
  });

  const [config, setConfig] = useState({
    gapSize: 20,
    levelThickness: 60,
    centerRadius: 70,
    arcPadding: 10,
  });

  const [selectedArc, setSelectedArc] = useState<{
    levelIndex: number;
    sectorIndex: number;
  } | null>(null);
  const [dragState, setDragState] = useState<{
    id: number;
    mode: "start" | "end" | "move";
    initialMouseX: number;
    initialMouseY: number;
    initialOffsetX: number;
    initialOffsetY: number;
    initialAngle: number;
    baseAngle: number;
  } | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);

  // --- MOUSE LOGIC ---
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState || !svgRef.current) return;
      const arrow = data.arrows.find((a) => a.id === dragState.id);
      if (!arrow) return;

      const rect = svgRef.current.getBoundingClientRect();
      const scale = SVG_SIZE / rect.width;

      if (dragState.mode === "move") {
        const dx = (e.clientX - dragState.initialMouseX) * scale;
        const dy = (e.clientY - dragState.initialMouseY) * scale;
        setData((prev) => ({
          ...prev,
          arrows: prev.arrows.map((a) =>
            a.id === dragState.id
              ? {
                  ...a,
                  offsetX: dragState.initialOffsetX + dx,
                  offsetY: dragState.initialOffsetY + dy,
                }
              : a
          ),
        }));
        return;
      }

      const mouseX = (e.clientX - rect.left) * scale;
      const mouseY = (e.clientY - rect.top) * scale;
      const relativeX = mouseX - (CENTER + arrow.offsetX);
      const relativeY = mouseY - (CENTER + arrow.offsetY);
      const newAngle = (Math.atan2(relativeY, relativeX) * 180) / Math.PI + 90;
      const newRadius = Math.sqrt(
        relativeX * relativeX + relativeY * relativeY
      );

      setData((prev) => ({
        ...prev,
        arrows: prev.arrows.map((a) => {
          if (a.id !== dragState.id) return a;
          return dragState.mode === "start"
            ? { ...a, startAngle: newAngle, radius: newRadius }
            : { ...a, endAngle: newAngle, radius: newRadius };
        }),
      }));
    },
    [dragState, data.arrows]
  );

  useEffect(() => {
    if (dragState) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", () => setDragState(null));
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", () => setDragState(null));
    };
  }, [dragState, handleMouseMove]);

  // --- ACTIONS ---
  const updateChannelText = (sectorIdx: number, text: string) => {
    setData((prev) => ({
      ...prev,
      channelTexts: {
        ...prev.channelTexts,
        [`channel-${sectorIdx}`]: text,
      },
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
    l: number,
    s: number,
    field: keyof ArcData,
    value: string
  ) => {
    const nl = [...data.levels];
    nl[l].arcs[s] = { ...nl[l].arcs[s], [field]: value };
    setData({ ...data, levels: nl });
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

  const downloadPNG = useCallback(() => {
    if (!svgRef.current) return;
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svgRef.current);
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = SVG_SIZE;
      canvas.height = SVG_SIZE;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, SVG_SIZE, SVG_SIZE);
        ctx.drawImage(img, 0, 0);
        const link = document.createElement("a");
        link.download = "export.png";
        link.href = canvas.toDataURL();
        link.click();
      }
    };
    img.src =
      "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(source)));
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      {/* --- SIDEBAR --- */}
      <div className="w-80 bg-white border-r p-5 overflow-y-auto flex flex-col gap-6 shadow-sm">
        <div>
          <h1 className="text-xl font-bold">Diagram Studio</h1>
          <p className="text-xs text-gray-400 uppercase tracking-tighter">
            Pro Editor
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase">
            Structure
          </h3>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase">
              Active Rings
            </label>
            <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
              {data.levels.map((lvl, idx) => (
                <div
                  key={lvl.id}
                  className="flex items-center justify-between p-2 bg-gray-50 border rounded text-xs"
                >
                  <span>Ring {idx + 1}</span>
                  <button
                    onClick={() => removeLevel(lvl.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold">Sectors</label>
            <input
              type="number"
              value={data.sectors}
              onChange={(e) => updateSectorCount(parseInt(e.target.value))}
              className="w-16 border rounded p-1 text-center"
            />
          </div>

          {/* New Section for Outermost Labels */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-400 uppercase">
              Outermost Curved Labels
            </label>
            <div className="space-y-1">
              {data.outermostLabels.map((label, idx) => (
                <input
                  key={`label-input-${idx}`}
                  type="text"
                  value={label}
                  onChange={(e) => updateOuterLabel(idx, e.target.value)}
                  placeholder={`Sector ${idx + 1} Outer Label`}
                  className="w-full text-xs p-2 border rounded bg-gray-50"
                />
              ))}
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t">
            <label className="text-[10px] font-bold text-gray-400 uppercase">
              Spacing
            </label>
            <div className="space-y-1">
              <label className="text-[10px]">Arch Gap</label>
              <input
                type="range"
                min="2"
                max="40"
                value={config.arcPadding}
                onChange={(e) =>
                  setConfig({ ...config, arcPadding: parseInt(e.target.value) })
                }
                className="w-full"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px]">Ring Gap</label>
              <input
                type="range"
                value={config.gapSize}
                onChange={(e) =>
                  setConfig({ ...config, gapSize: parseInt(e.target.value) })
                }
                className="w-full"
              />
            </div>
          </div>
          <button
            onClick={addLevel}
            className="w-full py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded text-xs font-bold"
          >
            + Add Level
          </button>
        </div>

        {selectedArc && data.levels[selectedArc.levelIndex] ? (
          <div className="p-4 bg-gray-50 rounded-lg border space-y-3">
            <span className="text-xs font-bold">Edit Arch Content</span>
            <textarea
              className="w-full p-2 text-sm border rounded"
              rows={2}
              value={
                data.levels[selectedArc.levelIndex].arcs[
                  selectedArc.sectorIndex
                ].text
              }
              onChange={(e) =>
                updateArc(
                  selectedArc.levelIndex,
                  selectedArc.sectorIndex,
                  "text",
                  e.target.value
                )
              }
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                type="color"
                className="w-full h-8 block"
                value={
                  data.levels[selectedArc.levelIndex].arcs[
                    selectedArc.sectorIndex
                  ].color
                }
                onChange={(e) =>
                  updateArc(
                    selectedArc.levelIndex,
                    selectedArc.sectorIndex,
                    "color",
                    e.target.value
                  )
                }
              />
              <input
                type="color"
                className="w-full h-8 block"
                value={
                  data.levels[selectedArc.levelIndex].arcs[
                    selectedArc.sectorIndex
                  ].textColor
                }
                onChange={(e) =>
                  updateArc(
                    selectedArc.levelIndex,
                    selectedArc.sectorIndex,
                    "textColor",
                    e.target.value
                  )
                }
              />
            </div>
            <button
              onClick={() => setSelectedArc(null)}
              className="w-full text-xs text-blue-500 py-1"
            >
              Close
            </button>
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic text-center border p-4 rounded-lg">
            Click an arch to edit its text/color
          </p>
        )}

        <button
          onClick={downloadPNG}
          className="mt-auto w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:bg-indigo-700 transition"
        >
          <Download size={20} /> Export PNG
        </button>
      </div>

      {/* --- CANVAS --- */}
      <div className="flex-1 flex items-center justify-center p-10 overflow-auto">
        <div className="bg-white shadow-2xl border">
          <svg
            ref={svgRef}
            width={SVG_SIZE}
            height={SVG_SIZE}
            viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
            className="w-[800px] h-[800px]"
          >
            <defs>
              <marker
                id="head-end"
                markerWidth="10"
                markerHeight="7"
                refX="9"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
              </marker>
              <marker
                id="head-start"
                markerWidth="10"
                markerHeight="7"
                refX="1"
                refY="3.5"
                orient="auto"
              >
                <polygon points="10 0, 0 3.5, 10 7" fill="currentColor" />
              </marker>
            </defs>

            {/* Center Area */}
            <circle
              cx={CENTER}
              cy={CENTER}
              r={config.centerRadius}
              fill="#fff"
              stroke="#ccc"
            />
            <foreignObject
              x={CENTER - config.centerRadius}
              y={CENTER - config.centerRadius}
              width={config.centerRadius * 2}
              height={config.centerRadius * 2}
            >
              <div className="w-full h-full flex items-center justify-center">
                <textarea
                  className="bg-transparent text-center font-bold text-xs w-full outline-none resize-none border-none"
                  value={data.centerText}
                  onChange={(e) =>
                    setData({ ...data, centerText: e.target.value })
                  }
                />
              </div>
            </foreignObject>

            {/* Arches Rendering */}
            {data.levels.map((lvl, lIdx) => {
              const r =
                config.centerRadius +
                config.gapSize +
                lIdx * (config.levelThickness + config.gapSize) +
                config.levelThickness / 2;

              const step = 360 / data.sectors;
              const isOuterMostLevel = lIdx === data.levels.length - 1;

              return (
                <g key={lvl.id}>
                  {lvl.arcs.map((arc, sIdx) => {
                    const s = sIdx * step + config.arcPadding / 2;
                    const e = (sIdx + 1) * step - config.arcPadding / 2;
                    const path = describeTextArc(CENTER, CENTER, r, s, e);

                    // Path for label sitting on top of the arch
                    const labelRadius = r + config.levelThickness / 2 + 12;
                    const labelPath = describeTextArc(
                      CENTER,
                      CENTER,
                      labelRadius,
                      s,
                      e
                    );

                    const isSelected =
                      selectedArc?.levelIndex === lIdx &&
                      selectedArc?.sectorIndex === sIdx;
                    return (
                      <g
                        key={`${lIdx}-${sIdx}`}
                        className="cursor-pointer"
                        onClick={() =>
                          setSelectedArc({
                            levelIndex: lIdx,
                            sectorIndex: sIdx,
                          })
                        }
                      >
                        <path
                          d={path.d}
                          fill="none"
                          stroke={arc.color}
                          strokeWidth={config.levelThickness}
                        />
                        {isSelected && (
                          <path
                            d={path.d}
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth={config.levelThickness + 4}
                            strokeOpacity="0.3"
                          />
                        )}
                        <path id={`p-${lIdx}-${sIdx}`} d={path.d} fill="none" />
                        <text
                          fill={arc.textColor}
                          className="text-[14px] font-bold pointer-events-none"
                        >
                          <textPath
                            href={`#p-${lIdx}-${sIdx}`}
                            startOffset="50%"
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            {arc.text}
                          </textPath>
                        </text>

                        {/* DYNAMIC TOP LABEL - Only render if this is the last level */}
                        {isOuterMostLevel && (
                          <>
                            <path
                              id={`outer-label-p-${sIdx}`}
                              d={labelPath.d}
                              fill="none"
                            />
                            <text
                              fill="#64748b"
                              className="text-[12px] font-bold pointer-events-none uppercase tracking-wide"
                            >
                              <textPath
                                href={`#outer-label-p-${sIdx}`}
                                startOffset="50%"
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                {data.outermostLabels[sIdx] || ""}
                              </textPath>
                            </text>
                          </>
                        )}
                      </g>
                    );
                  })}
                </g>
              );
            })}

            {/* Continuous Sector Gaps */}
            {Array.from({ length: data.sectors }).map((_, sIdx) => {
              const step = 360 / data.sectors;
              const channelAngle = (sIdx + 1) * step;
              const totalLevels = data.levels.length;

              const innerBoundary = config.centerRadius + config.gapSize;
              const outerBoundary =
                config.centerRadius +
                totalLevels * (config.levelThickness + config.gapSize);
              const channelLength = outerBoundary - innerBoundary;

              return (
                <g
                  key={`channel-grp-${sIdx}`}
                  transform={`rotate(${channelAngle}, ${CENTER}, ${CENTER})`}
                >
                  <foreignObject
                    x={CENTER - 20}
                    y={CENTER - outerBoundary}
                    width="40"
                    height={channelLength}
                    style={{ pointerEvents: "all" }}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <input
                        className="w-full bg-transparent text-[11px] font-bold text-center outline-none border-none hover:bg-gray-100/30 focus:bg-white/80 rounded transition-all"
                        placeholder="..."
                        style={{
                          transform: "rotate(-90deg)",
                          width: `${channelLength}px`,
                          whiteSpace: "nowrap",
                        }}
                        value={data.channelTexts[`channel-${sIdx}`] || ""}
                        onChange={(e) =>
                          updateChannelText(sIdx, e.target.value)
                        }
                      />
                    </div>
                  </foreignObject>
                </g>
              );
            })}

            {/* Arrows */}
            {data.arrows.map((a) => {
              const bStart = polarToCartesian(
                CENTER,
                CENTER,
                a.radius,
                a.startAngle
              );
              const bEnd = polarToCartesian(
                CENTER,
                CENTER,
                a.radius,
                a.endAngle
              );
              const handleStart = {
                x: bStart.x + a.offsetX,
                y: bStart.y + a.offsetY,
              };
              const handleEnd = {
                x: bEnd.x + a.offsetX,
                y: bEnd.y + a.offsetY,
              };
              return (
                <g key={a.id}>
                  <g
                    transform={`translate(${a.offsetX}, ${a.offsetY})`}
                    className="cursor-move"
                    onMouseDown={(e) =>
                      setDragState({
                        id: a.id,
                        mode: "move",
                        initialMouseX: e.clientX,
                        initialMouseY: e.clientY,
                        initialOffsetX: a.offsetX,
                        initialOffsetY: a.offsetY,
                        initialAngle: 0,
                        baseAngle: 0,
                      })
                    }
                  >
                    <path
                      d={
                        a.type === "curved"
                          ? describeTextArc(
                              CENTER,
                              CENTER,
                              a.radius,
                              a.startAngle,
                              a.endAngle
                            ).d
                          : `M ${bStart.x} ${bStart.y} L ${bEnd.x} ${bEnd.y}`
                      }
                      fill="none"
                      stroke={a.color}
                      strokeWidth="6"
                      markerEnd="url(#head-end)"
                      markerStart={
                        a.type === "double" ? "url(#head-start)" : ""
                      }
                    />
                  </g>
                  <circle
                    cx={handleStart.x}
                    cy={handleStart.y}
                    r="8"
                    className="fill-white stroke-blue-500 stroke-2 cursor-crosshair"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDragState({
                        id: a.id,
                        mode: "start",
                        initialMouseX: 0,
                        initialMouseY: 0,
                        initialOffsetX: a.offsetX,
                        initialOffsetY: a.offsetY,
                        initialAngle: 0,
                        baseAngle: 0,
                      });
                    }}
                  />
                  <circle
                    cx={handleEnd.x}
                    cy={handleEnd.y}
                    r="8"
                    className="fill-white stroke-blue-500 stroke-2 cursor-crosshair"
                    onMouseDown={(e) => {
                      e.stopPropagation();
                      setDragState({
                        id: a.id,
                        mode: "end",
                        initialMouseX: 0,
                        initialMouseY: 0,
                        initialOffsetX: a.offsetX,
                        initialOffsetY: a.offsetY,
                        initialAngle: 0,
                        baseAngle: 0,
                      });
                    }}
                  />
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
