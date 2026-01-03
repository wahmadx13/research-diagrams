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
    <div className="space-y-2 pt-2 border-t">
      <label className="text-[10px] font-bold text-gray-400 uppercase">
        Add Arrows
      </label>
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-2 border rounded hover:bg-gray-50 text-xs font-medium"
        >
          <span className="text-gray-700">Select Arrow Type</span>
          <ChevronDown
            size={14}
            className={`text-gray-500 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border rounded shadow-lg">
            {shapeOptions.map((option) => (
              <button
                key={option.type}
                onClick={() => handleSelect(option.type)}
                className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 border-b last:border-b-0 transition-colors"
              >
                <svg
                  width="60"
                  height="20"
                  viewBox="0 0 60 20"
                  className="flex-shrink-0"
                >
                  <ArrowPreview type={option.type} width={60} height={20} />
                </svg>
                <span className="text-xs text-gray-700">{option.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
