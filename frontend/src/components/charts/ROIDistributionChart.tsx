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
import { pluralize, truncateText } from "../../utils/chartUtils";
import { ChartContainer } from "../ui/ChartContainer";
import { ChartEmptyState } from "./ChartEmptyState";
import { CustomTooltip } from "./CustomTooltip";

interface ROIDistributionData {
  range: string;
  count: number;
  min: number;
  max: number;
}

interface ROIDistributionChartProps {
  data: ROIDistributionData[];
}

const getROIRangeColor = (entry: ROIDistributionData): string => {
  if (entry.min < 0) {
    return chartConfig.colors.negative;
  }

  if (entry.min >= 50 || entry.range.includes(">")) {
    return chartConfig.colors.success;
  }

  if (entry.min >= 25) {
    return "#22c55e";
  }

  return chartConfig.colors.warning;
};

const formatROITooltip = (
  value: number,
  _name: string,
  payload: TooltipPayload
): [string, string] => {
  const data = payload.payload as unknown as ROIDistributionData;
  const investmentText = `${value} ${pluralize(value, "investment")}`;

  return [investmentText, data.range];
};

export const ROIDistributionChart = memo(
  ({ data }: ROIDistributionChartProps) => {
    if (data.length === 0) {
      return (
        <ChartEmptyState
          title="ROI Distribution"
          message="Add investments to see how returns are distributed across different ranges."
          icon="chart"
        />
      );
    }

    return (
      <div
        className="bg-white rounded-xl shadow-lg p-6 transition-shadow duration-300 hover:shadow-xl"
        role="region"
        aria-label="ROI Distribution Chart"
      >
        <h2
          className="text-xl font-semibold text-gray-800 mb-6"
          id="roi-distribution-title"
        >
          ROI Distribution
        </h2>
        <ChartContainer height={300}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
            aria-labelledby="roi-distribution-title"
          >
            <defs>
              {data.map((entry, index) => {
                const color = getROIRangeColor(entry);
                return (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`roiGradient-${index}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="0"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={1} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.7} />
                  </linearGradient>
                );
              })}
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
            />
            <YAxis
              type="category"
              dataKey="range"
              width={100}
              tick={{
                fontSize: chartConfig.typography.axisLabel.fontSize,
                fill: chartConfig.colors.text,
              }}
              stroke={chartConfig.colors.border}
              tickFormatter={(value) => truncateText(value, 15)}
            />
            <Tooltip
              content={<CustomTooltip formatter={formatROITooltip} />}
              cursor={{ fill: "rgba(59, 130, 246, 0.1)" }}
            />
            <Bar dataKey="count" radius={[0, 8, 8, 0]}>
              {data.map((_entry, index) => (
                <Cell
                  key={`roi-cell-${index}`}
                  fill={`url(#roiGradient-${index})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    );
  }
);
