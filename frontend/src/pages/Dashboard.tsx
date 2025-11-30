import { useMemo } from "react";
import { InvestmentsByTypeChart } from "../components/charts/InvestmentsByTypeChart";
import { PortfolioValueChart } from "../components/charts/PortfolioValueChart";
import { ROIByAssetTypeChart } from "../components/charts/ROIByAssetTypeChart";
import { ROIDistributionChart } from "../components/charts/ROIDistributionChart";
import { TopPerformersChart } from "../components/charts/TopPerformersChart";
import { ValueByAssetTypeChart } from "../components/charts/ValueByAssetTypeChart";
import { RecentInvestmentsTable } from "../components/investments/RecentInvestmentsTable";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { StatCard } from "../components/ui/StatCard";
import {
  usePortfolioValueOverTime,
  useROIByAssetType,
  useROIDistribution,
  useTopPerformers,
} from "../hooks/useChartData";
import { useInvestmentData } from "../hooks/useInvestmentData";
import {
  formatCurrency,
  formatProfitLoss,
  formatROI,
} from "../utils/formatters";

const Dashboard = (): JSX.Element => {
  const { stats, investments, loading } = useInvestmentData();
  const portfolioValueOverTime = usePortfolioValueOverTime(investments);
  const roiDistribution = useROIDistribution(investments);
  const topPerformersByProfitLoss = useTopPerformers(investments);
  const roiByAssetType = useROIByAssetType(stats);

  const pieData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.byType).map(([type, data]) => ({
      name: type,
      value: data.count,
    }));
  }, [stats]);

  const barData = useMemo(() => {
    if (!stats) return [];
    return Object.entries(stats.byType).map(([type, data]) => ({
      name: type,
      invested: data.invested,
      current: data.current,
    }));
  }, [stats]);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (!stats) {
    return (
      <div className="text-center py-8 text-red-600">
        Failed to load dashboard data
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>

      {/* Tier 1: Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard
          title="Total Invested"
          value={`${formatCurrency(stats.summary.totalInvested)}`}
        />
        <StatCard
          title="Current Value"
          value={`${formatCurrency(stats.summary.totalCurrent)}`}
        />
        <StatCard
          title="Total ROI"
          value={formatROI(stats.summary.totalROI)}
          valueColor={stats.summary.totalROI >= 0 ? "green" : "red"}
        />
        <StatCard
          title="Profit/Loss"
          value={formatProfitLoss(stats.summary.totalProfitLoss)}
          valueColor={stats.summary.totalProfitLoss >= 0 ? "green" : "red"}
        />
        <StatCard title="Total Investments" value={stats.summary.totalCount} />
      </div>

      {/* Tier 2: Primary Overview - Portfolio Value Over Time */}
      <div className="mb-8">
        <PortfolioValueChart data={portfolioValueOverTime} />
      </div>

      {/* Tier 3: Performance Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TopPerformersChart data={topPerformersByProfitLoss} />
        <ROIByAssetTypeChart data={roiByAssetType} />
      </div>

      {/* Tier 4: Distribution & Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        <InvestmentsByTypeChart data={pieData} />
        <ROIDistributionChart data={roiDistribution} />
        <ValueByAssetTypeChart data={barData} />
      </div>

      {/* Tier 5: Recent Activity */}
      <RecentInvestmentsTable investments={investments} />
    </div>
  );
};

export default Dashboard;
