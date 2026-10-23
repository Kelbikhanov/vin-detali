import type { VinWhereResponse } from "../model/types";

const VINWHERE_API_URL = "https://vinwhere.com/api/v1/decode";

/** Расшифровывает VIN через публичный VinWhere API. */
export async function decodeVin(vin: string): Promise<VinWhereResponse> {
  const normalizedVin = vin.trim().toUpperCase();

  const url = new URL(VINWHERE_API_URL);
  url.searchParams.set("vin", normalizedVin);

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
    });
  } catch {
    throw new Error(
      "Не удалось подключиться к VinWhere. Проверьте интернет и попробуйте ещё раз.",
    );
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        "Слишком много запросов к сервису расшифровки VIN. Попробуйте немного позже.",
      );
    }

    throw new Error(
      `VinWhere вернул ошибку (${response.status}). Попробуйте ещё раз позже.`,
    );
  }

  let data: VinWhereResponse;
  try {
    data = (await response.json()) as VinWhereResponse;
  } catch {
    throw new Error("Сервис VinWhere вернул ответ в неизвестном формате.");
  }

  if (!data || typeof data !== "object") {
    throw new Error("Сервис VinWhere вернул пустой или некорректный ответ.");
  }

  if (data.ok === false) {
    throw new Error(
      data.message || data.error || "Не удалось расшифровать этот VIN.",
    );
  }

  return data;
}
