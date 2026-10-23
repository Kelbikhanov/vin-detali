"use client";

import { useId, useRef, useState } from "react";
import { useOutsideClick } from "@/shared/lib/useOutsideClick";
import { Dropdown } from "./Dropdown";
import { Option } from "./types";

export type SelectProps = {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
};

export function Select({
  label,
  name,
  value,
  onChange,
  options,
  placeholder = "Выберите значение",
  required,
  disabled,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();
  const selected = options.find((o) => o.value === value);

  useOutsideClick(rootRef, () => setOpen(false), open);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    if (e.key === "Escape") setOpen(false);
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((v) => !v);
    }
  };

  return (
    <div className="flex flex-col gap-2.25" ref={rootRef}>
      <label
        htmlFor={`${name}-trigger`}
        className="text-xs font-extrabold uppercase tracking-wider text-gray-800"
      >
        {label}
      </label>

      <div className="relative">
        {/* Скрытый input — FormData/required работают как с нативным select */}
        <input type="hidden" name={name} value={value} required={required} />

        <button
          id={`${name}-trigger`}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          disabled={disabled}
          onClick={() => !disabled && setOpen((v) => !v)}
          onKeyDown={handleKeyDown}
          className={[
            "flex h-12 w-full items-center justify-between gap-2 rounded-[7px] border bg-white px-3.5 text-left text-base font-semibold outline-none transition-all",
            "focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(23,105,232,0.1)]",
            disabled
              ? "cursor-not-allowed border-gray-200 text-gray-400"
              : "cursor-pointer border-gray-400",
          ].join(" ")}
        >
          <span className={selected ? "text-gray-900" : "text-gray-400"}>
            {selected ? selected.label : placeholder}
          </span>

          {/* Единственная стрелка. rotate-90 при открытии */}
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className={[
              "h-4 w-4 flex-shrink-0 text-gray-500 transition-transform duration-200",
              open ? "rotate-90" : "rotate-0",
            ].join(" ")}
          >
            <path
              d="m6 9 6 6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </button>

        {open && !disabled && (
          <Dropdown
            id={listboxId}
            options={options}
            value={value}
            onSelect={(option) => {
              onChange(option.value);
              setOpen(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
