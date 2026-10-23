/** Ответ публичного API VinWhere. Поля могут отсутствовать у отдельных автомобилей. */
export interface VinWhereDecode {
  year?: string | null;
  make?: string | null;
  model?: string | null;
  trim?: string | null;
  bodyClass?: string | null;
  vehicleType?: string | null;
  engineCylinders?: string | null;
  displacement?: string | null;
  fuelType?: string | null;
  driveType?: string | null;
  manufacturer?: string | null;
  plantCountry?: string | null;
  [key: string]: string | number | boolean | null | undefined;
}

export interface VinWhereResponse {
  ok: boolean;
  vin: string;
  valid: boolean;
  checkDigitValid: boolean | null;
  decode?: VinWhereDecode | null;
  attribution?: string;
  error?: string;
  message?: string;
}
