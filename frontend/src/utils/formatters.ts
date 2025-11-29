export const formatCurrency = (value: number): string => {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

export const formatDate = (date: string | Date): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toLocaleDateString();
};

export const formatROI = (roi: number): string => {
  return `${roi >= 0 ? "+" : ""}${roi.toFixed(2)}%`;
};

export const formatProfitLoss = (value: number): string => {
  return `${value >= 0 ? "+" : ""}$${formatCurrency(value)}`;
};
