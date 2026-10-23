"use client";

import { Option } from "./types";

type DropdownProps = {
  options: Option[];
  value: string;
  onSelect: (option: Option) => void;
  id: string;
};

export function Dropdown({ options, value, onSelect, id }: DropdownProps) {
  if (options.length === 0) {
    return (
      <ul
        id={id}
        role="listbox"
        className="absolute z-30 mt-1.5 w-full rounded-[7px] border border-gray-200 bg-white px-3.5 py-3 text-sm font-semibold text-gray-500 shadow-lg"
      >
        <li>Нет вариантов</li>
      </ul>
    );
  }

  return (
    <ul
      id={id}
      role="listbox"
      className="absolute z-30 mt-1.5 max-h-64 w-full overflow-auto rounded-[7px] border border-gray-200 bg-white py-1 shadow-lg"
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <li key={option.value}>
            <button
              type="button"
              role="option"
              aria-selected={isSelected}
              onClick={() => onSelect(option)}
              className={[
                "flex w-full cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 text-left text-sm font-semibold transition-colors",
                isSelected
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-900 hover:bg-gray-50",
              ].join(" ")}
            >
              <span className="truncate">{option.label}</span>
              {isSelected && (
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="h-4 w-4 flex-shrink-0"
                >
                  <path
                    d="m5 12 5 5L20 7"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
