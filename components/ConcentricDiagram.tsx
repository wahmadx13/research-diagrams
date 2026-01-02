"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Download, Plus, Trash2 } from "lucide-react";

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
    arrows: [] as ArrowData[],
  });

  const [config, setConfig] = useState({
    gapSize: 20,
    levelThickness: 60,
    centerRadius: 70,
    arcPadding: 2,
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

  // --- SMOOTH ROTATION HELPER ---
  const getAngle = (clientX: number, clientY: number, arrow: ArrowData) => {
    if (!svgRef.current) return 0;
    const rect = svgRef.current.getBoundingClientRect();
    const x =
      clientX -
      (rect.left + rect.width / 2 + (arrow.offsetX * rect.width) / SVG_SIZE);
    const y =
      clientY -
      (rect.top + rect.height / 2 + (arrow.offsetY * rect.height) / SVG_SIZE);
    return (Math.atan2(y, x) * 180) / Math.PI + 90;
  };

  // --- MOUSE LOGIC ---
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!dragState) return;
      const arrow = data.arrows.find((a) => a.id === dragState.id);
      if (!arrow) return;

      if (dragState.mode === "move") {
        const scale =
          SVG_SIZE / (svgRef.current?.getBoundingClientRect().width || 1);
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
      } else {
        const currentMouseAngle = getAngle(e.clientX, e.clientY, arrow);
        const deltaAngle = currentMouseAngle - dragState.initialAngle;
        const newAngle = (dragState.baseAngle + deltaAngle) % 360;

        setData((prev) => ({
          ...prev,
          arrows: prev.arrows.map((a) => {
            if (a.id !== dragState.id) return a;
            return dragState.mode === "start"
              ? { ...a, startAngle: newAngle }
              : { ...a, endAngle: newAngle };
          }),
        }));
      }
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
  const addLevel = () => {
    const newArcs = Array(data.sectors)
      .fill(null)
      .map(() => ({ text: "New", color: "#e2e8f0", textColor: "#333" }));
    setData((prev) => ({
      ...prev,
      levels: [...prev.levels, { id: `lvl-${Date.now()}`, arcs: newArcs }],
    }));
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
    setData((prev) => ({
      ...prev,
      sectors: n,
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
    }));
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
          <div className="flex justify-between items-center">
            <label className="text-sm">Sectors</label>
            <input
              type="number"
              value={data.sectors}
              onChange={(e) => updateSectorCount(parseInt(e.target.value))}
              className="w-16 border rounded p-1"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px]">Arch Gap (Horizontal)</label>
            <input
              type="range"
              min="0"
              max="20"
              value={config.arcPadding}
              onChange={(e) =>
                setConfig({ ...config, arcPadding: parseInt(e.target.value) })
              }
              className="w-full"
            />
            <label className="text-[10px]">Ring Gap (Vertical)</label>
            <input
              type="range"
              value={config.gapSize}
              onChange={(e) =>
                setConfig({ ...config, gapSize: parseInt(e.target.value) })
              }
              className="w-full"
            />
          </div>
          <button
            onClick={addLevel}
            className="w-full py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded text-xs font-bold"
          >
            + Add Level
          </button>
        </div>

        {/* --- ARC EDITOR (RESTORED) --- */}
        {selectedArc ? (
          <div className="p-4 bg-gray-50 rounded-lg border space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold">Edit Arch</span>
              <button
                onClick={() => setSelectedArc(null)}
                className="text-[10px] text-blue-500"
              >
                Close
              </button>
            </div>
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
              <div>
                <label className="text-[10px]">Fill</label>
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
              </div>
              <div>
                <label className="text-[10px]">Text</label>
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
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic text-center border p-4 rounded-lg">
            Click an arc to edit its text/color
          </p>
        )}

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-gray-400 uppercase">Arrows</h3>
          <button
            onClick={() =>
              setData((prev) => ({
                ...prev,
                arrows: [
                  ...prev.arrows,
                  {
                    id: Date.now(),
                    type: "single",
                    startAngle: 0,
                    endAngle: 45,
                    radius: 200,
                    color: "#ef4444",
                    offsetX: 0,
                    offsetY: 0,
                  },
                ],
              }))
            }
            className="w-full py-2 bg-gray-800 text-white rounded text-xs font-bold"
          >
            + New Arrow
          </button>
          <div className="max-h-32 overflow-y-auto space-y-1">
            {data.arrows.map((a) => (
              <div
                key={a.id}
                className="flex gap-2 p-1 border rounded items-center"
              >
                <select
                  className="text-[10px] flex-1"
                  value={a.type}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      arrows: prev.arrows.map((ar) =>
                        ar.id === a.id
                          ? { ...ar, type: e.target.value as ArrowType }
                          : ar
                      ),
                    }))
                  }
                >
                  <option value="single">Single</option>
                  <option value="double">Double</option>
                  <option value="curved">Curved</option>
                </select>
                <button
                  onClick={() =>
                    setData((prev) => ({
                      ...prev,
                      arrows: prev.arrows.filter((ar) => ar.id !== a.id),
                    }))
                  }
                >
                  <Trash2 size={12} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>

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

            {/* Arches */}
            {data.levels.map((lvl, lIdx) => {
              const r =
                config.centerRadius +
                config.gapSize +
                lIdx * (config.levelThickness + config.gapSize) +
                config.levelThickness / 2;
              const step = 360 / data.sectors;
              return lvl.arcs.map((arc, sIdx) => {
                const s = sIdx * step + config.arcPadding / 2;
                const e = (sIdx + 1) * step - config.arcPadding / 2;
                const path = describeTextArc(CENTER, CENTER, r, s, e);
                const isSelected =
                  selectedArc?.levelIndex === lIdx &&
                  selectedArc?.sectorIndex === sIdx;
                return (
                  <g
                    key={`${lIdx}-${sIdx}`}
                    className="cursor-pointer"
                    onClick={() =>
                      setSelectedArc({ levelIndex: lIdx, sectorIndex: sIdx })
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
                  </g>
                );
              });
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
              const sP = { x: bStart.x + a.offsetX, y: bStart.y + a.offsetY };
              const eP = { x: bEnd.x + a.offsetX, y: bEnd.y + a.offsetY };

              const startMove = (e: React.MouseEvent) => {
                e.stopPropagation();
                setDragState({
                  id: a.id,
                  mode: "move",
                  initialMouseX: e.clientX,
                  initialMouseY: e.clientY,
                  initialOffsetX: a.offsetX,
                  initialOffsetY: a.offsetY,
                  initialAngle: 0,
                  baseAngle: 0,
                });
              };

              const startRotate = (
                e: React.MouseEvent,
                mode: "start" | "end"
              ) => {
                e.stopPropagation();
                setDragState({
                  id: a.id,
                  mode,
                  initialMouseX: 0,
                  initialMouseY: 0,
                  initialOffsetX: a.offsetX,
                  initialOffsetY: a.offsetY,
                  initialAngle: getAngle(e.clientX, e.clientY, a),
                  baseAngle: mode === "start" ? a.startAngle : a.endAngle,
                });
              };

              return (
                <g key={a.id} style={{ color: a.color }} className="group">
                  <g
                    transform={`translate(${a.offsetX}, ${a.offsetY})`}
                    onMouseDown={startMove}
                    className="cursor-move"
                  >
                    {a.type === "curved" ? (
                      <path
                        d={
                          describeTextArc(
                            CENTER,
                            CENTER,
                            a.radius,
                            a.startAngle,
                            a.endAngle
                          ).d
                        }
                        fill="none"
                        stroke="transparent"
                        strokeWidth="20"
                      />
                    ) : (
                      <line
                        x1={bStart.x}
                        y1={bStart.y}
                        x2={bEnd.x}
                        y2={bEnd.y}
                        stroke="transparent"
                        strokeWidth="20"
                      />
                    )}
                  </g>
                  <g
                    transform={`translate(${a.offsetX}, ${a.offsetY})`}
                    className="pointer-events-none"
                  >
                    {a.type === "curved" ? (
                      <path
                        d={
                          describeTextArc(
                            CENTER,
                            CENTER,
                            a.radius,
                            a.startAngle,
                            a.endAngle
                          ).d
                        }
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        markerEnd="url(#head-end)"
                        markerStart={
                          a.type === "double" ? "url(#head-start)" : ""
                        }
                      />
                    ) : (
                      <line
                        x1={bStart.x}
                        y1={bStart.y}
                        x2={bEnd.x}
                        y2={bEnd.y}
                        stroke="currentColor"
                        strokeWidth="3"
                        markerEnd="url(#head-end)"
                        markerStart={
                          a.type === "double" ? "url(#head-start)" : ""
                        }
                      />
                    )}
                  </g>
                  <circle
                    cx={sP.x}
                    cy={sP.y}
                    r="8"
                    className="fill-white stroke-current cursor-crosshair opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => startRotate(e, "start")}
                  />
                  <circle
                    cx={eP.x}
                    cy={eP.y}
                    r="8"
                    className="fill-white stroke-current cursor-crosshair opacity-0 group-hover:opacity-100 transition-opacity"
                    onMouseDown={(e) => startRotate(e, "end")}
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
