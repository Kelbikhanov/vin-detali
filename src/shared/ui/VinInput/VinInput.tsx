"use client";

import { useId, useState } from "react";
import { validateVin } from "@/shared/lib/validateVin";

export type VinInputProps = {
  value: string;
  onChange: (value: string) => void;
};

export function VinInput({ value, onChange }: VinInputProps) {
  const inputId = useId();
  const errorId = useId();

  // Ошибка формата показывается после ухода с поля, чтобы не мешать вводу.
  const [touched, setTouched] = useState(false);

  const validation = validateVin(value);
  const showError = touched && !validation.ok && value.length > 0;
  const errorMessage = !validation.ok ? validation.message : "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Приводим к верхнему регистру сразу — VIN всегда капсом
    onChange(e.target.value.toUpperCase().slice(0, 17));
    // При вводе сбрасываем «затронутость», чтобы ошибка исчезла
    if (touched) setTouched(false);
  };

  const handleBlur = () => {
    if (value.length > 0) setTouched(true);
  };

  return (
    <div className="flex flex-col gap-2.25">
      <label
        htmlFor={inputId}
        className="text-xs font-extrabold text-gray-800 uppercase tracking-wider"
      >
        <span className="text-xs font-semibold text-gray-600">
          Введите <b className="text-gray-800">VIN-номер</b>
        </span>
      </label>

      <div
        className={[
          "flex items-center gap-3 rounded-[7px] border bg-white p-[6px] transition-all",
          showError
            ? "border-red-500 focus-within:border-red-500 focus-within:shadow-[0_0_0_3px_rgba(239,68,68,0.12)]"
            : "border-gray-400 focus-within:border-blue-500 focus-within:shadow-[0_0_0_3px_rgba(23,105,232,0.1)]",
        ].join(" ")}
      >
        <svg
          viewBox="0 0 24 24"
          aria-hidden="true"
          className={[
            "h-5 w-5 flex-shrink-0",
            showError ? "text-red-500" : "text-gray-600",
          ].join(" ")}
        >
          <path
            d="M4 7.5 6 4h12l2 3.5V19H4V7.5Z"
            stroke="currentColor"
            strokeWidth="1.7"
            fill="none"
          />
          <path
            d="M4 10h16M8 14h2m4 0h2"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>

        <input
          id={inputId}
          type="text"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          maxLength={17}
          placeholder="Например, XW8ZZZ61ZHG000000"
          autoComplete="off"
          autoCapitalize="characters"
          spellCheck={false}
          aria-invalid={showError || undefined}
          aria-describedby={showError ? errorId : undefined}
          className={[
            "flex-1 border-0 bg-transparent outline-none font-semibold text-base placeholder:text-gray-400",
            showError ? "text-red-500" : "text-gray-900",
          ].join(" ")}
        />
      </div>

      {showError ? (
        <p
          id={errorId}
          role="alert"
          className="text-xs text-red-500 leading-relaxed"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
