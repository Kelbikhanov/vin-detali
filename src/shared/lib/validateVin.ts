export type VinValidation = { ok: true } | { ok: false; message: string };

const VIN_ALLOWED = /^[A-HJ-NPR-Z0-9]*$/; // без I, O, Q
const VIN_FULL = /^[A-HJ-NPR-Z0-9]{17}$/;

export function validateVin(raw: string): VinValidation {
  const value = raw.trim().toUpperCase();

  if (value.length === 0) {
    return { ok: true }; // поле необязательное
  }

  if (/[А-Яа-яЁё]/.test(raw)) {
    return {
      ok: false,
      message:
        "VIN не может содержать кириллицу. Проверьте раскладку клавиатуры.",
    };
  }

  if (/[\s\-]/.test(raw)) {
    return {
      ok: false,
      message: "VIN не может содержать пробелы и дефисы.",
    };
  }

  if (/[IOQ]/.test(value)) {
    return {
      ok: false,
      message:
        "VIN не может содержать буквы I, O, Q — их путают с цифрами 1 и 0.",
    };
  }

  if (!VIN_ALLOWED.test(value)) {
    return {
      ok: false,
      message: "VIN может содержать только латинские буквы и цифры.",
    };
  }

  if (value.length < 17) {
    return {
      ok: false,
      message: `VIN должен содержать 17 символов. Сейчас введено ${value.length}.`,
    };
  }

  if (!VIN_FULL.test(value)) {
    return { ok: false, message: "Проверьте правильность ввода VIN." };
  }

  return { ok: true };
}
