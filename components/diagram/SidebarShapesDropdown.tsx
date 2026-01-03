"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { ShapeType } from "@/types/diagram";
import { ArrowPreview } from "./shapes/ArrowPreview";

interface SidebarShapesDropdownProps {
  onAddShape: (type: ShapeType) => void;
}

const shapeOptions: Array<{ type: ShapeType; label: string }> = [
  { type: "single", label: "Single Arrow" },
  { type: "double", label: "Double Arrow" },
  { type: "single-curved", label: "Single Curved Arrow" },
  { type: "double-curved", label: "Double Curved Arrow" },
];

export function SidebarShapesDropdown({
  onAddShape,
}: SidebarShapesDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  const handleSelect = (type: ShapeType) => {
    onAddShape(type);
    setIsOpen(false);
  };

  return (
    <div className="p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-sm space-y-3">
      <label className="text-xs font-semibold text-gray-700 block">
        Add Arrows
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span>Select Arrow Type</span>
          <ChevronDown
            size={16}
            className={`text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">
            {shapeOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleSelect(option.type)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors text-left"
              >
                <svg
                  width="60"
                  height="20"
                  viewBox="0 0 60 20"
                  className="flex-shrink-0"
                >
                  <ArrowPreview type={option.type} width={60} height={20} />
                </svg>
                <span className="text-xs font-medium text-gray-700">
                  {option.label}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
