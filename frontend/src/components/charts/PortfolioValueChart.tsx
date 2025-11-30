import { memo } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartConfig } from "../../config/chartConfig";
import type { TooltipPayload } from "../../types/chart";
import { formatCompactNumber } from "../../utils/chartUtils";
import { formatCurrency } from "../../utils/formatters";
import { ChartContainer } from "../ui/ChartContainer";
import { ChartEmptyState } from "./ChartEmptyState";
import { CustomTooltip } from "./CustomTooltip";

interface PortfolioValueChartProps {
  data: { month: string; invested: number; current: number }[];
}

export const PortfolioValueChart = memo(
  ({ data }: PortfolioValueChartProps) => {
    if (data.length === 0) {
      return (
        <ChartEmptyState
          title="Portfolio Value Over Time"
          message="Start tracking your investments to see how your portfolio value changes over time."
          icon="chart"
        />
      );
    }

    const tooltipFormatter = (
      value: number,
      name: string,
      payload: TooltipPayload
    ): [string, string] => {
      const formattedValue = formatCurrency(value);

      if (
        payload.payload &&
        payload.payload.invested &&
        payload.payload.current
      ) {
        const invested = payload.payload.invested as number;
        const current = payload.payload.current as number;
        const gain = current - invested;
        const gainPercent =
          invested > 0 ? ((gain / invested) * 100).toFixed(1) : "0.0";

        if (name === "Cumulative Current Value") {
          const trend = gain >= 0 ? "↑" : "↓";
          const trendColor = gain >= 0 ? "+" : "";
          return [
            `${formattedValue} (${trend} ${trendColor}${gainPercent}%)`,
            name,
          ];
        }
      }

      return [formattedValue, name];
    };

    return (
      <div
        className="bg-white rounded-xl shadow-lg p-6 transition-shadow duration-300 hover:shadow-xl"
        role="region"
        aria-label="Portfolio Value Over Time Chart"
      >
        <h2
          className="text-xl font-semibold text-gray-800 mb-6"
          id="portfolio-value-title"
        >
          Portfolio Value Over Time
        </h2>
        <ChartContainer height={400}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            aria-labelledby="portfolio-value-title"
          >
            <defs>
              <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.colors.primary}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.colors.primary}
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={chartConfig.colors.success}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={chartConfig.colors.success}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={chartConfig.colors.grid}
              opacity={chartConfig.chart.gridOpacity}
            />
            <XAxis
              dataKey="month"
              angle={-45}
              textAnchor="end"
              height={80}
              interval="preserveStartEnd"
              tick={{
                fontSize: chartConfig.typography.axisLabel.fontSize,
                fill: chartConfig.colors.text,
              }}
              stroke={chartConfig.colors.border}
            />
            <YAxis
              tickFormatter={formatCompactNumber}
              tick={{
                fontSize: chartConfig.typography.axisLabel.fontSize,
                fill: chartConfig.colors.text,
              }}
              stroke={chartConfig.colors.border}
            />
            <Tooltip content={<CustomTooltip formatter={tooltipFormatter} />} />
            <Legend
              wrapperStyle={{
                paddingTop: `${chartConfig.spacing.legendPaddingTop}px`,
                fontSize: chartConfig.typography.legendText.fontSize,
              }}
              iconType="line"
              iconSize={16}
            />
            <Area
              type="monotone"
              dataKey="invested"
              fill="url(#colorInvested)"
              stroke="none"
            />
            <Area
              type="monotone"
              dataKey="current"
              fill="url(#colorCurrent)"
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="cumulativeInvested"
              stroke={chartConfig.colors.primary}
              strokeWidth={chartConfig.chart.strokeWidth.line}
              name="Cumulative Invested"
              dot={{
                r: chartConfig.chart.dotSize.default,
                fill: chartConfig.colors.primary,
                strokeWidth: 0,
              }}
              activeDot={{
                r: chartConfig.chart.dotSize.active,
                strokeWidth: 2,
                stroke: chartConfig.colors.background,
              }}
            />
            <Line
              type="monotone"
              dataKey="cumulativeCurrent"
              stroke={chartConfig.colors.success}
              strokeWidth={chartConfig.chart.strokeWidth.line}
              name="Cumulative Current Value"
              dot={{
                r: chartConfig.chart.dotSize.default,
                fill: chartConfig.colors.success,
                strokeWidth: 0,
              }}
              activeDot={{
                r: chartConfig.chart.dotSize.active,
                strokeWidth: 2,
                stroke: chartConfig.colors.background,
              }}
            />
          </ComposedChart>
        </ChartContainer>
      </div>
    );
  }
);
