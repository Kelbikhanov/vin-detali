"use client";

import { useId } from "react";
import { Button } from "@/shared/ui/Button";

export type PartInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
};

export function PartInput({
  value,
  onChange,
  onSubmit,
  name = "part",
  required = true,
  disabled = false,
}: PartInputProps) {
  const inputId = useId();
  const hintId = useId();

  return (
    <div className="flex flex-col gap-2.25">
      <label
        htmlFor={inputId}
        className="text-xs font-extrabold text-gray-800 uppercase tracking-wider"
      >
        Какая деталь нужна?
      </label>

      <div className={`flex items-center gap-3 rounded-[7px] border pl-3 transition-all ${disabled ? "cursor-not-allowed border-gray-200 bg-gray-100 opacity-70" : "border-gray-400 bg-white focus-within:border-blue-500 focus-within:shadow-[0_0_0_3px_rgba(23,105,232,0.1)]"}`}>
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className="h-5 w-5 flex-shrink-0 text-gray-600"
        >
          <circle
            cx="10.8"
            cy="10.8"
            r="6.8"
            stroke="currentColor"
            strokeWidth="1.7"
            fill="none"
          />
          <path
            d="m16 16 4.5 4.5"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>

        <input
          id={inputId}
          name={name}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSubmit();
            }
          }}
          placeholder="Например, передние тормозные колодки"
          required={required}
          autoComplete="off"
          aria-describedby={hintId}
          className="flex-1 border-0 bg-transparent outline-none font-semibold text-base text-gray-900 placeholder:text-gray-400 disabled:cursor-not-allowed disabled:text-gray-500"
        />

        <Button type="submit" disabled={disabled} className={disabled ? "cursor-not-allowed opacity-50" : ""}>
          <span>Найти запчасть</span>
        </Button>
      </div>

      <p id={hintId} className="text-xs text-gray-600 leading-relaxed">
        {disabled
          ? "Введите корректный VIN или укажите автомобиль вручную"
          : "Можно написать своими словами или указать OEM-номер"}
      </p>
    </div>
  );
}
