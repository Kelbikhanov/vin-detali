"use client";

import { useState } from "react";

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

type PartsResultsProps = {
  items?: PartItem[];
  isLoading?: boolean;
  searched?: boolean;
};

const mockParts: PartItem[] = [
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

function formatPrice(price: number, currency = "₽") {
  return `${new Intl.NumberFormat("ru-RU").format(price)} ${currency}`;
}

function PartImage({ image, name }: { image?: string | null; name: string }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50 sm:h-28 sm:w-32">
      {image && !imageError ? (
        <img
          src={image}
          alt={name}
          loading="lazy"
          onError={() => setImageError(true)}
          className="h-full w-full object-contain p-2"
        />
      ) : (
        <svg
          viewBox="0 0 48 48"
          fill="none"
          className="h-11 w-11 text-gray-400"
          aria-hidden="true"
        >
          <rect
            x="7"
            y="7"
            width="34"
            height="34"
            rx="5"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <circle
            cx="18"
            cy="18"
            r="3"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="m10 35 11-11 7 7 4-4 6 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

function PartCard({ item }: { item: PartItem }) {
  const [copied, setCopied] = useState(false);

  async function copyArticle() {
    try {
      await navigator.clipboard.writeText(item.article);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-4 shadow-card sm:flex-row sm:items-center sm:p-5">
      <PartImage image={item.image} name={item.name} />

      <div className="min-w-0 flex-1">
        <div className="flex flex-col items-start justify-start">
          {item.brand && (
            <p className="mb-1.5 text-xs font-extrabold uppercase tracking-wider text-gray-600">
              {item.brand}
            </p>
          )}

          <h3 className="text-lg font-extrabold leading-snug text-gray-900">
            {item.name}
          </h3>
        </div>

        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-600">Артикул:</span>

          <code className="rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-sm font-semibold text-gray-800">
            {item.article}
          </code>

          <button
            type="button"
            onClick={copyArticle}
            className="text-xs font-extrabold text-blue-700 transition-colors hover:text-blue-800"
          >
            {copied ? "Скопировано" : "Копировать"}
          </button>
        </div>

        {item.seller && (
          <p className="flex mt-3 text-sm text-gray-600">
            Продавец:{" "}
            <span className="font-bold text-gray-800">{item.seller}</span>
          </p>
        )}
      </div>

      <div className="flex shrink-0 items-center justify-between gap-4 border-t border-gray-200 pt-4 sm:min-w-36 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
        <div>
          {item.price != null ? (
            <p className="text-xl font-extrabold text-gray-900">
              {formatPrice(item.price, item.currency)}
            </p>
          ) : (
            <p className="text-sm text-gray-600">Цена не указана</p>
          )}
        </div>

        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-[7px] bg-blue-700 px-4 text-sm font-extrabold text-white transition-colors hover:bg-blue-800"
        >
          Перейти
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path
              d="M7 17 17 7M7 7h10v10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </article>
  );
}

function LoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="rounded-2xl border border-gray-200 bg-white px-5 py-10 text-center shadow-card"
    >
      <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-[3px] border-blue-100 border-t-blue-700" />

      <h3 className="text-lg font-extrabold text-gray-900">
        Ищем подходящие запчасти
      </h3>

      <p className="mt-2 text-sm leading-relaxed text-gray-600">
        Анализируем запрос и подбираем детали.
        <br />
        Это может занять несколько секунд.
      </p>

      <div className="mx-auto mt-6 h-1.5 max-w-52 overflow-hidden rounded-full bg-blue-50">
        <div className="h-full w-1/2 animate-pulse rounded-full bg-blue-700" />
      </div>
    </div>
  );
}

export default function PartsResults({
  items,
  isLoading = false,
  searched = false,
}: PartsResultsProps) {
  const [showDemo, setShowDemo] = useState(false);

  const results = items ?? (showDemo ? mockParts : []);

  return (
    <section className="mt-7.5 space-y-4">
      {isLoading && <LoadingState />}

      {!isLoading && results.length > 0 && (
        <>
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div className="flex flex-col items-start">
              <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">
                Найденные запчасти
              </h2>
              <p className="mt-1 text-sm text-gray-600">
                Сравните артикулы и предложения продавцов
              </p>
            </div>

            <span className="rounded-[7px] border border-blue-100 bg-blue-50 px-3 py-2 text-xs font-extrabold text-blue-700">
              Найдено: {results.length}
            </span>
          </div>

          <div className="space-y-3.5">
            {results.map((item) => (
              <PartCard key={item.id} item={item} />
            ))}
          </div>

          <p className="text-xs leading-relaxed text-gray-600">
            Перед покупкой проверьте совместимость детали с автомобилем. Цены и
            наличие уточняйте у продавца.
          </p>
        </>
      )}

      {!isLoading && searched && results.length === 0 && (
        <div className="rounded-2xl border border-gray-200 bg-white px-5 py-10 text-center shadow-card">
          <h3 className="text-lg font-extrabold text-gray-900">
            Пока ничего не найдено
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Попробуйте уточнить название детали или проверить данные автомобиля.
          </p>
        </div>
      )}

      {!isLoading && !searched && results.length === 0 && (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-8 text-center">
          <p className="text-sm text-gray-600">
            Результаты поиска появятся здесь
          </p>

          <button
            type="button"
            onClick={() => setShowDemo(true)}
            className="mt-3 text-sm font-extrabold text-blue-700 transition-colors hover:text-blue-800"
          >
            Показать пример оформления
          </button>
        </div>
      )}
    </section>
  );
}
