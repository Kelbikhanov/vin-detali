"use client";

import { useQuery } from "@tanstack/react-query";
import { decodeVin } from "../api/vinwhere";

export const vehicleQueryKeys = {
  all: ["vehicle"] as const,
  decodeVin: (vin: string) => [...vehicleQueryKeys.all, "decode-vin", vin] as const,
};

/** Запрос не стартует сам: его запускают вручную через refetch() по кнопке. */
export function useDecodeVinQuery(vin: string) {
  const normalizedVin = vin.trim().toUpperCase();

  return useQuery({
    queryKey: vehicleQueryKeys.decodeVin(normalizedVin),
    queryFn: () => decodeVin(normalizedVin),
    enabled: false,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });
}
