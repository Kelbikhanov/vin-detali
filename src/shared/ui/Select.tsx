import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: { value: string; label: string }[];
}

export function Select({
  label,
  options = [],
  className,
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2.25">
      {label && (
        <label className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        className={`h-12 px-3.5 bg-white border border-gray-400 rounded-lg outline-none transition-all text-base font-semibold text-gray-900 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(23,105,232,0.1)] ${
          className || ""
        }`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
