"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
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
  const [inputValue, setInputValue] = useState("");
  const [highlighted, setHighlighted] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listboxId = useId();

  // Синхронизируем текст в поле с внешним value.
  // Если value совпадает с опцией — показываем её label, иначе — сам текст.
  useEffect(() => {
    const selected = options.find((o) => o.value === value);
    setInputValue(selected ? selected.label : value);
  }, [value, options]);

  useOutsideClick(rootRef, () => setOpen(false), open);

  const filtered = useMemo(() => {
    const q = inputValue.trim().toLowerCase();
    if (!q) return options;
    // Если текущее значение совпадает с выбранной опцией — показываем весь список
    const selected = options.find((o) => o.value === value);
    if (selected && selected.label.toLowerCase() === q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [inputValue, options, value]);

  useEffect(() => {
    setHighlighted(filtered.length > 0 ? 0 : -1);
  }, [filtered]);

  const commitValue = (next: string) => {
    const match = options.find(
      (o) => o.label.toLowerCase() === next.trim().toLowerCase(),
    );
    onChange(match ? match.value : next.trim());
  };

  const handleSelect = (option: Option) => {
    setInputValue(option.label);
    onChange(option.value);
    setOpen(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setHighlighted((i) =>
        filtered.length === 0 ? -1 : (i + 1) % filtered.length,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open) {
        setOpen(true);
        return;
      }
      setHighlighted((i) =>
        filtered.length === 0
          ? -1
          : (i - 1 + filtered.length) % filtered.length,
      );
    } else if (e.key === "Enter") {
      if (open && highlighted >= 0 && filtered[highlighted]) {
        e.preventDefault();
        handleSelect(filtered[highlighted]);
      } else {
        // Закрываем и коммитим введённый текст
        setOpen(false);
        commitValue(inputValue);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div className="flex flex-col gap-2.25" ref={rootRef}>
      <label
        htmlFor={`${name}-input`}
        className="text-xs font-extrabold uppercase tracking-wider text-gray-800"
      >
        {label}
      </label>

      <div className="relative">
        {/* Скрытый input — FormData/required работают как с нативным select */}
        <input type="hidden" name={name} value={value} required={required} />

        <input
          ref={inputRef}
          id={`${name}-input`}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-autocomplete="list"
          autoComplete="off"
          disabled={disabled}
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setOpen(true);
          }}
          onFocus={() => !disabled && setOpen(true)}
          onClick={() => !disabled && setOpen(true)}
          onKeyDown={handleKeyDown}
          onBlur={() => commitValue(inputValue)}
          className={[
            "h-12 w-full rounded-[7px] border bg-white px-3.5 pr-10 text-base font-semibold outline-none transition-all",
            "placeholder:font-normal placeholder:text-gray-400",
            "focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(23,105,232,0.1)]",
            disabled
              ? "cursor-not-allowed border-gray-200 text-gray-400"
              : "border-gray-400 text-gray-900",
          ].join(" ")}
        />

        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={[
            "pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 transition-transform duration-200",
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

        {open && !disabled && (
          <Dropdown
            id={listboxId}
            options={filtered}
            value={value}
            highlightedIndex={highlighted}
            onHover={setHighlighted}
            onSelect={handleSelect}
          />
        )}
      </div>
    </div>
  );
}
