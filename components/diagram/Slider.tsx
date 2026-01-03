"use client";

import { useState } from "react";

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  tooltip?: string;
}

export function Slider({
  label,
  value,
  min,
  max,
  onChange,
  tooltip,
}: SliderProps) {
  const [localInputValue, setLocalInputValue] = useState(value.toString());
  const [isEditing, setIsEditing] = useState(false);

  const displayValue = isEditing ? localInputValue : value.toString();

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(e.target.value);
    onChange(newValue);
    setLocalInputValue(newValue.toString());
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setLocalInputValue(newValue);
    setIsEditing(true);
    const numValue = parseInt(newValue);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleInputBlur = () => {
    const numValue = parseInt(localInputValue);
    if (isNaN(numValue) || numValue < min) {
      setLocalInputValue(min.toString());
      onChange(min);
    } else if (numValue > max) {
      setLocalInputValue(max.toString());
      onChange(max);
    } else {
      setLocalInputValue(numValue.toString());
    }
    setIsEditing(false);
  };

  const handleInputFocus = () => {
    setIsEditing(true);
  };

  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
          {label}
          {tooltip && (
            <span
              className="text-[10px] text-gray-400 cursor-help"
              title={tooltip}
            >
              ⓘ
            </span>
          )}
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={displayValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onFocus={handleInputFocus}
            min={min}
            max={max}
            className="w-20 px-2.5 py-1.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-medium shadow-sm"
          />
          <span className="text-xs text-gray-500 w-8">/ {max}</span>
        </div>
      </div>
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-150"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={handleSliderChange}
          onMouseDown={() => {
            setIsEditing(true);
          }}
          onMouseUp={() => {
            setIsEditing(false);
          }}
          className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-white border-2 border-blue-500 rounded-full shadow-lg transform transition-transform hover:scale-110"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
    </div>
  );
}
