import { memo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartConfig } from "../../config/chartConfig";
import type { TooltipPayload } from "../../types/chart";
import {
  formatCompactNumber,
  formatROIPercent,
  truncateText,
} from "../../utils/chartUtils";
import { formatCurrency } from "../../utils/formatters";
import { ChartContainer } from "../ui/ChartContainer";
import { ChartEmptyState } from "./ChartEmptyState";
import { CustomTooltip } from "./CustomTooltip";

interface TopPerformersChartProps {
  data: {
    name: string;
    fullName: string;
    profitLoss: number;
    roi: number;
  }[];
}

export const TopPerformersChart = memo(({ data }: TopPerformersChartProps) => {
  if (data.length === 0) {
    return (
      <ChartEmptyState
        title="Top Performers by Profit/Loss"
        message="Add investments to see which assets are performing best in your portfolio."
        icon="chart"
      />
    );
  }

  const tooltipFormatter = (
    value: number,
    _name: string,
    payload: TooltipPayload
  ): [string, string] => {
    const roi = (payload.payload?.roi as number) ?? 0;
    return [
      `${formatCurrency(value)} (${formatROIPercent(roi)})`,
      "Profit/Loss",
    ];
  };

  const labelFormatter = (label: string): string => {
    const fullEntry = data.find((entry) => entry.name === label);
    return fullEntry?.fullName || label;
  };

  return (
    <div
      className="bg-white rounded-xl shadow-lg p-6 transition-shadow duration-300 hover:shadow-xl"
      role="region"
      aria-label="Top Performers by Profit/Loss Chart"
    >
      <h2
        className="text-xl font-semibold text-gray-800 mb-6"
        id="top-performers-title"
      >
        Top Performers by Profit/Loss
      </h2>
      <ChartContainer height={350}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          aria-labelledby="top-performers-title"
        >
          <defs>
            <linearGradient id="positiveGradient" x1="0" y1="0" x2="1" y2="0">
              <stop
                offset="0%"
                stopColor={chartConfig.colors.positive}
                stopOpacity={0.7}
              />
              <stop
                offset="100%"
                stopColor={chartConfig.colors.positive}
                stopOpacity={1}
              />
            </linearGradient>
            <linearGradient id="negativeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop
                offset="0%"
                stopColor={chartConfig.colors.negative}
                stopOpacity={1}
              />
              <stop
                offset="100%"
                stopColor={chartConfig.colors.negative}
                stopOpacity={0.7}
              />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={chartConfig.colors.grid}
            opacity={chartConfig.chart.gridOpacity}
          />
          <XAxis
            type="number"
            tick={{
              fontSize: chartConfig.typography.axisLabel.fontSize,
              fill: chartConfig.colors.text,
            }}
            stroke={chartConfig.colors.border}
            domain={["dataMin", "dataMax"]}
            tickFormatter={formatCompactNumber}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={100}
            tick={{
              fontSize: chartConfig.typography.axisLabel.fontSize,
              fill: chartConfig.colors.text,
            }}
            stroke={chartConfig.colors.border}
            tickFormatter={(value) => truncateText(value, 18)}
          />
          <Tooltip
            content={
              <CustomTooltip
                formatter={tooltipFormatter}
                labelFormatter={labelFormatter}
              />
            }
            cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
          />
          <Bar dataKey="profitLoss" radius={[0, 8, 8, 0]} barSize={28}>
            {data.map((entry, index) => (
              <Cell
                key={`profit-cell-${index}`}
                fill={
                  entry.profitLoss >= 0
                    ? "url(#positiveGradient)"
                    : "url(#negativeGradient)"
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
});
