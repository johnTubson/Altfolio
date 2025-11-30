import { useMemo } from "react";
import { Investment, InvestmentStats } from "../types";

export const usePortfolioValueOverTime = (investments: Investment[]) => {
  return useMemo(() => {
    if (investments.length === 0) return [];
    const sortedInvestments = [...investments].sort((a, b) => {
      const dateA = new Date(a.investmentDate).getTime();
      const dateB = new Date(b.investmentDate).getTime();
      return dateA - dateB;
    });
    let cumulativeInvested = 0;
    let cumulativeCurrent = 0;
    const monthlyData: Record<
      string,
      { invested: number; current: number; date: Date }
    > = {};
    sortedInvestments.forEach((inv) => {
      const date = new Date(inv.investmentDate);
      const monthKey = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;
      cumulativeInvested += inv.investedAmount;
      cumulativeCurrent += inv.currentValue;
      monthlyData[monthKey] = {
        invested: cumulativeInvested,
        current: cumulativeCurrent,
        date: new Date(date.getFullYear(), date.getMonth(), 1),
      };
    });
    const sortedData = Object.values(monthlyData).sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );

    return sortedData.map((values, index) => {
      const ind = index - 1;
      const prevInvested =
        index > 0 ? (sortedData[ind] ? sortedData[ind].invested : 0) : 0;
      const prevCurrent =
        index > 0 ? (sortedData[ind] ? sortedData[ind].current : 0) : 0;

      return {
        month: values.date.toLocaleDateString("en-US", {
          month: "short",
          year: "numeric",
        }),
        invested: Math.round((values.invested - prevInvested) * 100) / 100,
        current: Math.round((values.current - prevCurrent) * 100) / 100,
        cumulativeInvested: Math.round(values.invested * 100) / 100,
        cumulativeCurrent: Math.round(values.current * 100) / 100,
      };
    });
  }, [investments]);
};
export const useROIDistribution = (investments: Investment[]) => {
  return useMemo(() => {
    const bins = [
      { range: "<-50%", min: -Infinity, max: -50, count: 0 },
      { range: "-50% to -25%", min: -50, max: -25, count: 0 },
      { range: "-25% to 0%", min: -25, max: 0, count: 0 },
      { range: "0% to 25%", min: 0, max: 25, count: 0 },
      { range: "25% to 50%", min: 25, max: 50, count: 0 },
      { range: "50% to 100%", min: 50, max: 100, count: 0 },
      { range: ">100%", min: 100, max: Infinity, count: 0 },
    ];
    investments.forEach((inv) => {
      const roi = inv.returnOnInvestment ?? 0;
      const bin =
        bins.find((b) => {
          if (b.min === -Infinity) return roi < b.max;
          if (b.max === Infinity) return roi >= b.min;
          return roi >= b.min && roi < b.max;
        }) ?? bins[bins.length - 1]!;
      bin.count++;
    });
    return bins.filter((bin) => bin.count > 0);
  }, [investments]);
};

export const useTopPerformers = (investments: Investment[]) => {
  return useMemo<
    {
      name: string;
      fullName: string;
      profitLoss: number;
      roi: number;
    }[]
  >(() => {
    if (investments.length === 0) return [];
    const withProfitLoss = investments.map((inv) => ({
      name:
        inv.assetName.length > 20
          ? inv.assetName.substring(0, 20) + "..."
          : inv.assetName,
      fullName: inv.assetName,
      profitLoss: inv.profitLoss ?? inv.currentValue - inv.investedAmount,
      roi: inv.returnOnInvestment ?? 0,
    }));
    const sorted = [...withProfitLoss].sort(
      (a, b) => b.profitLoss - a.profitLoss
    );
    return sorted.slice(0, 10);
  }, [investments]);
};

export const useROIByAssetType = (stats: InvestmentStats | null) => {
  return useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.byType)
      .map(([type, data]) => {
        const avgROI =
          data.invested > 0
            ? ((data.current - data.invested) / data.invested) * 100
            : 0;
        return {
          name: type,
          roi: Math.round(avgROI * 100) / 100,
          count: data.count,
        };
      })
      .sort((a, b) => b.roi - a.roi);
  }, [stats]);
};
