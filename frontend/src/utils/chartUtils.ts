import type { ChartDataItem, ChartDataItemWithPercent } from "../types/chart";

export const calculatePercentage = (value: number, total: number): string => {
  if (total === 0) return "0.0";
  return ((value / total) * 100).toFixed(1);
};

export const addPercentageToData = (
  data: ChartDataItem[]
): ChartDataItemWithPercent[] => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return data.map((item) => ({
    ...item,
    percent: calculatePercentage(item.value, total),
  }));
};

export const formatValueWithPercent = (
  value: number,
  total: number
): string => {
  const percent = calculatePercentage(value, total);
  return `${value} (${percent}%)`;
};

export const formatCompactNumber = (value: number): string => {
  const absValue = Math.abs(value);
  const sign = value >= 0 ? "" : "-";

  if (absValue >= 1000000) {
    return `${sign}${(absValue / 1000000).toFixed(1)}M`;
  }
  if (absValue >= 1000) {
    return `${sign}${(absValue / 1000).toFixed(1)}K`;
  }
  return `${sign}${absValue.toLocaleString()}`;
};

export const formatCompactCurrency = (value: number): string => {
  const absValue = Math.abs(value);
  const sign = value >= 0 ? "" : "-";

  if (absValue >= 1000000) {
    return `${sign}${(absValue / 1000000).toFixed(1)}M`;
  }
  if (absValue >= 1000) {
    return `${sign}${(absValue / 1000).toFixed(0)}K`;
  }
  return `${sign}${absValue.toLocaleString()}`;
};

export const formatCurrencyFull = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.substring(0, maxLength - 3)}...`;
};

export const formatROIPercent = (
  value: number,
  decimals: number = 2
): string => {
  const sign = value >= 0 ? "+" : "";
  return `${sign}${value.toFixed(decimals)}%`;
};

export const formatROIAxisLabel = (value: number): string => {
  return `${value >= 0 ? "+" : ""}${value.toFixed(0)}%`;
};

export const pluralize = (
  count: number,
  singular: string,
  plural?: string
): string => {
  if (count === 1) return singular;
  return plural || `${singular}s`;
};
