"use client";

import { Minus, Plus } from "lucide-react";

interface StepperInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  tooltip?: string;
}

export function StepperInput({
  label,
  value,
  min,
  max,
  onChange,
  tooltip,
}: StepperInputProps) {
  const handleDecrement = () => {
    if (value > min) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max) {
      onChange(value + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value);
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      onChange(numValue);
    }
  };

  const handleInputBlur = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = parseInt(e.target.value);
    if (isNaN(numValue) || numValue < min) {
      onChange(min);
    } else if (numValue > max) {
      onChange(max);
    }
  };

  return (
    <div className="space-y-2">
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
        <button
          onClick={handleDecrement}
          disabled={value <= min}
          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Minus size={14} className="text-gray-700" />
        </button>
        <input
          type="number"
          value={value}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          min={min}
          max={max}
          className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center font-medium"
        />
        <button
          onClick={handleIncrement}
          disabled={value >= max}
          className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Plus size={14} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}
