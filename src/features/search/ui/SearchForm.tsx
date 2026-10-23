"use client";

import { FormEvent, useMemo, useState } from "react";
import { Select } from "@/shared/ui/Select/Select";
import { Option } from "@/shared/ui/Select/types";
import { TrustRow } from "./TrustRow";
import { generateYears } from "../lib/generateYears";
import { VinInput } from "@/shared/ui/VinInput/VinInput";
import { PartInput } from "@/shared/ui/PartInput/PartInput";
import { validateVin } from "@/shared/lib/validateVin";
import PartsResults from "./PartsResults";

type PartItem = {
  id: string;
  name: string;
  article: string;
  brand?: string;
  image?: string | null;
  url: string;
  price?: number | null;
  currency?: string;
  seller?: string;
};

export const mockParts: PartItem[] = [
  {
    id: "1",
    name: "Фильтр масляный двигателя",
    article: "06L115562B",
    brand: "VAG",
    image: null,
    url: "https://www.ozon.ru/",
    price: 1850,
    seller: "Ozon",
  },
  {
    id: "2",
    name: "Фильтр масляный",
    article: "HU 7020 z",
    brand: "MANN-FILTER",
    image: null,
    url: "https://www.exist.ru/",
    price: 1290,
    seller: "Exist.ru",
  },
  {
    id: "3",
    name: "Фильтр масляный двигателя",
    article: "WL7506",
    brand: "WIX",
    image: null,
    url: "https://www.wildberries.ru/",
    price: null,
    seller: "Wildberries",
  },
];

type MakeData = { value: string; label: string; models: string[] };

const MAKES: MakeData[] = [
  { value: "bmw", label: "BMW", models: ["3 Series", "5 Series", "X5"] },
  {
    value: "mercedes",
    label: "Mercedes-Benz",
    models: ["C-Class", "E-Class", "GLC"],
  },
  { value: "audi", label: "Audi", models: ["A4", "A6", "Q5"] },
  { value: "vw", label: "Volkswagen", models: ["Golf", "Passat", "Tiguan"] },
  { value: "skoda", label: "Škoda", models: ["Octavia", "Superb", "Kodiaq"] },
  { value: "toyota", label: "Toyota", models: ["Corolla", "Camry", "RAV4"] },
  {
    value: "hyundai",
    label: "Hyundai",
    models: ["Solaris", "Creta", "Tucson"],
  },
  { value: "kia", label: "Kia", models: ["Rio", "Sportage", "Sorento"] },
  { value: "lada", label: "LADA", models: ["Vesta", "Granta", "Niva"] },
  {
    value: "renault",
    label: "Renault",
    models: ["Logan", "Duster", "Arkana"],
  },
  {
    value: "nissan",
    label: "Nissan",
    models: ["Almera", "Qashqai", "X-Trail"],
  },
  { value: "other", label: "Другая марка", models: [] },
];

const YEAR_OPTIONS: Option[] = generateYears();

export function SearchForm() {
  const [demoMessage, setDemoMessage] = useState("");
  const [vin, setVin] = useState("");
  const [manualMode, setManualMode] = useState(false);
  const [engine, setEngine] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [part, setPart] = useState("");
  const [items, setItems] = useState<PartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const vinValidation = validateVin(vin);
  const vinReady = vin.trim().length === 17 && vinValidation.ok;
  const manualVehicleReady = Boolean(manualMode && make && model && year);
  const canSearch = vinReady || manualVehicleReady;

  const makeOptions = useMemo<Option[]>(
    () => MAKES.map(({ value, label }) => ({ value, label })),
    [],
  );

  const modelOptions = useMemo<Option[]>(() => {
    const current = MAKES.find((m) => m.value === make);
    return (current?.models ?? []).map((m) => ({ value: m, label: m }));
  }, [make]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setDemoMessage("");

    const normalizedVin = vin.trim().toUpperCase();
    const useManualVehicle = manualMode && manualVehicleReady;
    const useVin = !useManualVehicle && vinReady;

    if (!useVin && !useManualVehicle) {
      if (normalizedVin) {
        setDemoMessage(
          vinValidation.ok
            ? "Введите полный VIN из 17 символов или заполните данные автомобиля вручную."
            : vinValidation.message,
        );
      } else {
        setDemoMessage(
          "Введите VIN или укажите марку, модель и год автомобиля вручную.",
        );
      }
      return;
    }

    if (!part.trim()) {
      setDemoMessage("Укажите, какую деталь нужно найти.");
      return;
    }

    const payload = useManualVehicle
      ? {
          make: MAKES.find((item) => item.value === make)?.label ?? make,
          model,
          year,
          engine: engine.trim() || undefined,
          search: part.trim(),
        }
      : {
          vin: normalizedVin,
          search: part.trim(),
        };

    setIsLoading(true);
    setSearched(true);
    setItems([]);

    try {
      const response = await fetch("/api/parts/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        const message =
          typeof data === "object" &&
          data !== null &&
          "error" in data &&
          typeof data.error === "string"
            ? data.error
            : "Не удалось выполнить поиск. Попробуйте ещё раз.";
        throw new Error(message);
      }

      if (
        typeof data !== "object" ||
        data === null ||
        !("items" in data) ||
        !Array.isArray(data.items)
      ) {
        throw new Error("Сервер вернул некорректный ответ.");
      }

      const nextItems = data.items.filter(
        (item): item is PartItem =>
          typeof item === "object" &&
          item !== null &&
          "id" in item &&
          "name" in item &&
          "article" in item &&
          "url" in item &&
          typeof item.id === "string" &&
          typeof item.name === "string" &&
          typeof item.article === "string" &&
          typeof item.url === "string",
      );

      setItems(nextItems);
      setDemoMessage(
        "message" in data && typeof data.message === "string"
          ? data.message
          : nextItems.length
            ? "Поиск завершён."
            : "Подходящие предложения не подтверждены. Попробуйте уточнить запрос.",
      );
    } catch (error) {
      setItems([]);
      setDemoMessage(
        error instanceof Error
          ? error.message
          : "Не удалось выполнить поиск. Попробуйте ещё раз.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="mt-7.5 rounded-3xl border border-gray-200 bg-white p-7.5 shadow-card">
        <div className="mb-6 flex items-start justify-between gap-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-600">
              Поиск в 3 шага
            </p>
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
              Для какого автомобиля ищем?
            </h2>
          </div>
          <div className="inline-flex flex-shrink-0 items-center gap-1.75 rounded-[7px] border border-blue-100 bg-blue-50 px-3 py-2">
            <span className="text-xs font-extrabold text-blue-600">
              AI-поиск
            </span>
          </div>
        </div>

        <form
          id="search-form"
          onSubmit={handleSubmit}
          className="flex flex-col gap-5.5"
        >
          <VinInput
            value={vin}
            onChange={(value) => {
              setVin(value);
              setDemoMessage("");
            }}
          />

          <p className="-mt-3 text-sm text-gray-600">
            или можете{" "}
            <button
              type="button"
              aria-expanded={manualMode}
              aria-controls="manual-vehicle-fields"
              onClick={() => {
                setManualMode((current) => !current);
                setDemoMessage("");
              }}
              className="font-semibold text-blue-700 underline underline-offset-2 transition-colors hover:text-blue-800"
            >
              {manualMode
                ? "скрыть ручной ввод данных"
                : "ввести данные вручную"}
            </button>
          </p>

          {manualMode && (
            <div
              id="manual-vehicle-fields"
              className="grid grid-cols-2 gap-3.5 rounded-xl border border-gray-200 bg-gray-50 p-4 md:grid-cols-4"
            >
              <Select
                label="Марка"
                name="make"
                value={make}
                onChange={(v) => {
                  setMake(v);
                  setModel("");
                }}
                options={makeOptions}
                placeholder="Выберите марку"
                required={manualMode && !vinReady}
              />

              <Select
                label="Модель"
                name="model"
                value={model}
                onChange={setModel}
                options={modelOptions}
                placeholder={make ? "Выберите модель" : "Сначала марка"}
                required={manualMode && !vinReady}
                disabled={!make}
              />

              <Select
                label="Год выпуска"
                name="year"
                value={year}
                onChange={setYear}
                options={YEAR_OPTIONS}
                placeholder="Выберите год"
                required={manualMode && !vinReady}
              />

              <div className="flex flex-col gap-2.25">
                <label className="text-xs font-extrabold text-gray-800 uppercase tracking-wider">
                  Двигатель
                </label>
                <input
                  name="engine"
                  value={engine}
                  onChange={(e) => setEngine(e.target.value)}
                  placeholder="Например, 1.8 TSI"
                  className="h-12 px-3.5 bg-white border border-gray-400 rounded-[7px] outline-none transition-all text-base font-semibold text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:shadow-[0_0_0_3px_rgba(23,105,232,0.1)]"
                />
              </div>
            </div>
          )}

          <PartInput
            value={part}
            onChange={(value) => {
              setPart(value);
              setDemoMessage("");
            }}
            disabled={!canSearch}
            onSubmit={() => {
              // программный submit формы
              (
                document.getElementById("search-form") as HTMLFormElement | null
              )?.requestSubmit();
            }}
          />

          <div className="flex flex-col gap-3 border-t border-gray-200 pt-4.25 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-1.75">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-gray-600">
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="10"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  fill="none"
                />
                <path
                  d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v2"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-xs font-semibold text-gray-600">
                Данные автомобиля используются только для поиска
              </span>
            </div>
            <div className="flex items-center gap-1.75">
              <div className="flex gap-0.75">
                <span className="h-1.25 w-1.25 rounded-full bg-blue-700 opacity-85"></span>
                <span className="h-1.25 w-1.25 rounded-full bg-blue-700 opacity-55"></span>
                <span className="h-1.25 w-1.25 rounded-full bg-blue-700 opacity-30"></span>
              </div>
              <span className="text-xs font-semibold text-gray-600">
                Поиск по разным площадкам
              </span>
            </div>
          </div>
        </form>
      </section>

      {demoMessage && (
        <p className="mt-3 text-sm leading-relaxed text-blue-600" role="status">
          {demoMessage}
        </p>
      )}

      <TrustRow />

      <PartsResults items={searched ? items : undefined} isLoading={isLoading} searched={searched} />
    </>
  );
}
