import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

type SearchPayload =
  | { vin: string; search: string }
  | {
      make: string;
      model: string;
      year: string;
      engine?: string;
      search: string;
    };

type PartResult = {
  id: string;
  name: string;
  article: string;
  brand?: string;
  image?: string | null;
  url: string;
  price?: number | null;
  currency?: string;
  seller?: string;
  compatibility_verified?: boolean;
  match_type?: "exact" | "analogue" | "unknown";
};

const SYSTEM_PROMPT = `
Ты — помощник по подбору автомобильных запчастей VINDetali Bot.
Тебе передают данные автомобиля и название нужной детали.
Отвечай на русском языке и возвращай только корректный JSON без Markdown и пояснений вне JSON.

Формат ответа:
{
  "status": "found" | "partial" | "not_found" | "needs_clarification",
  "message": "короткое пояснение для пользователя",
  "items": [
    {
      "id": "уникальная строка",
      "name": "название детали",
      "article": "артикул или пустая строка",
      "brand": "бренд, если известен",
      "image": null,
      "url": "прямая ссылка на конкретное предложение или пустая строка",
      "price": null,
      "currency": "₽",
      "seller": "продавец, если подтверждён",
      "compatibility_verified": false,
      "match_type": "exact" | "analogue" | "unknown"
    }
  ]
}

Правила достоверности:
- Не выдумывай существование товара, артикулы, URL конкретных товаров, продавцов, цены, наличие или подтверждённую совместимость.
- У тебя нет гарантированного доступа к актуальным каталогам продавцов в рамках этого запроса. Поэтому не выдавай предположения как найденные реальные предложения.
- Если не можешь достоверно подтвердить конкретные предложения, верни пустой массив items и объясни, какие данные помогут сузить поиск (например, OEM-номер, код двигателя, комплектация).
- Не создавай ссылки на главные страницы магазинов вместо ссылок на конкретные товары.
- Не помечай совместимость как подтверждённую без достоверного основания.
- Если VIN указан, не угадывай характеристики автомобиля по VIN. Если данные автомобиля не были достоверно расшифрованы, скажи об этом.
- Максимум 10 результатов. Не добавляй поля, которых нет в схеме.
`;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cleanString(value: unknown, maxLength = 500): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function normalizeItems(value: unknown): PartResult[] {
  if (!Array.isArray(value)) return [];

  return value.slice(0, 10).filter(isRecord).map((item, index) => {
    const rawPrice = item.price;
    const price =
      typeof rawPrice === "number" && Number.isFinite(rawPrice) && rawPrice >= 0
        ? rawPrice
        : null;
    const rawUrl = cleanString(item.url, 2000);
    let safeUrl = "";
    try {
      const parsed = new URL(rawUrl);
      if (parsed.protocol === "https:" || parsed.protocol === "http:") {
        safeUrl = parsed.toString();
      }
    } catch {
      // Некорректные URL не показываем как ссылки.
    }

    const rawMatchType = item.match_type;
    const matchType =
      rawMatchType === "exact" ||
      rawMatchType === "analogue" ||
      rawMatchType === "unknown"
        ? rawMatchType
        : "unknown";

    return {
      id: cleanString(item.id, 100) || `part-${index + 1}`,
      name: cleanString(item.name, 300) || "Запчасть без названия",
      article: cleanString(item.article, 100),
      brand: cleanString(item.brand, 100) || undefined,
      image: null,
      url: safeUrl,
      price,
      currency: cleanString(item.currency, 10) || "₽",
      seller: cleanString(item.seller, 150) || undefined,
      compatibility_verified: item.compatibility_verified === true,
      match_type: matchType,
    };
  });
}

function validatePayload(value: unknown): SearchPayload | null {
  if (!isRecord(value)) return null;

  const search = cleanString(value.search, 300);
  if (!search) return null;

  const vin = cleanString(value.vin, 17).toUpperCase();
  if (vin) {
    if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(vin)) return null;
    return { vin, search };
  }

  const make = cleanString(value.make, 100);
  const model = cleanString(value.model, 100);
  const year = cleanString(value.year, 4);
  const engine = cleanString(value.engine, 100);

  if (!make || !model || !/^\d{4}$/.test(year)) return null;

  return { make, model, year, engine: engine || undefined, search };
}

export async function POST(request: Request) {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "На сервере не настроен DEEPSEEK_API_KEY." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Некорректный JSON в запросе." },
      { status: 400 },
    );
  }

  const payload = validatePayload(body);
  if (!payload) {
    return NextResponse.json(
      { error: "Проверьте данные автомобиля и название запчасти." },
      { status: 400 },
    );
  }

  const userMessage = [
    "Данные автомобиля и запрос пользователя:",
    JSON.stringify(payload, null, 2),
    "",
    "Верни результат строго в указанном JSON-формате. Не выдумывай реальные предложения, цены или ссылки.",
  ].join("\n");

  let upstream: Response;
  try {
    upstream = await fetch("https://api.deepseek.com/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userMessage },
        ],
        temperature: 0.1,
        response_format: { type: "json_object" },
        stream: false,
      }),
      signal: AbortSignal.timeout(55_000),
    });
  } catch (error) {
    const timedOut =
      error instanceof Error &&
      (error.name === "TimeoutError" || error.name === "AbortError");
    return NextResponse.json(
      {
        error: timedOut
          ? "DeepSeek не ответил вовремя. Попробуйте ещё раз."
          : "Не удалось подключиться к DeepSeek. Проверьте соединение и попробуйте позже.",
      },
      { status: 502 },
    );
  }

  if (!upstream.ok) {
    // Не передаём клиенту тело ответа провайдера: в нём могут быть лишние детали.
    const status = upstream.status === 429 ? 429 : 502;
    return NextResponse.json(
      {
        error:
          upstream.status === 401 || upstream.status === 403
            ? "DeepSeek отклонил API-ключ. Проверьте DEEPSEEK_API_KEY."
            : upstream.status === 429
              ? "Превышен лимит запросов DeepSeek. Попробуйте позже."
              : `DeepSeek вернул ошибку (${upstream.status}). Попробуйте позже.`,
      },
      { status },
    );
  }

  let data: unknown;
  try {
    data = await upstream.json();
  } catch {
    return NextResponse.json(
      { error: "DeepSeek вернул ответ в неизвестном формате." },
      { status: 502 },
    );
  }

  const content =
    isRecord(data) &&
    Array.isArray(data.choices) &&
    isRecord(data.choices[0]) &&
    isRecord(data.choices[0].message)
      ? data.choices[0].message.content
      : null;

  if (typeof content !== "string") {
    return NextResponse.json(
      { error: "В ответе DeepSeek нет результата поиска." },
      { status: 502 },
    );
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    return NextResponse.json(
      { error: "Не удалось разобрать ответ DeepSeek. Попробуйте ещё раз." },
      { status: 502 },
    );
  }

  if (!isRecord(parsed)) {
    return NextResponse.json(
      { error: "DeepSeek вернул некорректный формат результата." },
      { status: 502 },
    );
  }

  const status =
    parsed.status === "found" ||
    parsed.status === "partial" ||
    parsed.status === "not_found" ||
    parsed.status === "needs_clarification"
      ? parsed.status
      : "not_found";

  return NextResponse.json({
    status,
    message: cleanString(parsed.message, 1000) || "Обработка запроса завершена.",
    items: normalizeItems(parsed.items),
  });
}
