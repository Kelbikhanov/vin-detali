export function generateYears(from = 1980): Array<{ value: string; label: string }> {
  const years: Array<{ value: string; label: string }> = [];
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= from; year--) {
    years.push({ value: String(year), label: String(year) });
  }
  return years;
}
