import { memo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartConfig, getChartColor } from "../../config/chartConfig";
import {
  formatCompactCurrency,
  formatCurrencyFull,
} from "../../utils/chartUtils";
import { ChartContainer } from "../ui/ChartContainer";
import { ChartEmptyState } from "./ChartEmptyState";
import { CustomTooltip } from "./CustomTooltip";

interface ValueByAssetTypeChartProps {
  data: { name: string; invested: number; current: number }[];
}

interface TooltipFormatterProps {
  payload?: { name: string; invested: number; current: number };
}

export const ValueByAssetTypeChart = memo(
  ({ data }: ValueByAssetTypeChartProps) => {
    if (data.length === 0) {
      return (
        <ChartEmptyState
          title="Value by Asset Type"
          message="Add investments to compare invested amounts and current values across asset types."
          icon="chart"
        />
      );
    }

    return (
      <div
        className="bg-white rounded-xl shadow-lg p-6 transition-shadow duration-300 hover:shadow-xl"
        role="region"
        aria-label="Value by Asset Type Chart"
      >
        <h2
          className="text-xl font-semibold text-gray-800 mb-6"
          id="value-by-asset-type-title"
        >
          Value by Asset Type
        </h2>
        <ChartContainer height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            aria-labelledby="value-by-asset-type-title"
          >
            <defs>
              <linearGradient id="investedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={getChartColor(0)}
                  stopOpacity={1}
                />
                <stop
                  offset="100%"
                  stopColor={getChartColor(0)}
                  stopOpacity={0.7}
                />
              </linearGradient>
              <linearGradient id="currentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={chartConfig.colors.success}
                  stopOpacity={1}
                />
                <stop
                  offset="100%"
                  stopColor={chartConfig.colors.success}
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
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{
                fontSize: chartConfig.typography.axisLabel.fontSize,
                fill: chartConfig.colors.text,
              }}
              stroke={chartConfig.colors.border}
            />
            <YAxis
              tickFormatter={formatCompactCurrency}
              tick={{
                fontSize: chartConfig.typography.axisLabel.fontSize,
                fill: chartConfig.colors.text,
              }}
              stroke={chartConfig.colors.border}
            />
            <Tooltip
              content={<CustomTooltip />}
              formatter={(
                value: number,
                name: string,
                _props: TooltipFormatterProps
              ): [string, string] => {
                return [formatCurrencyFull(value), name];
              }}
            />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                paddingTop: `${chartConfig.spacing.legendPaddingTop}px`,
                fontSize: chartConfig.typography.legendText.fontSize,
              }}
              iconType="circle"
              iconSize={10}
            />
            <Bar
              dataKey="invested"
              fill="url(#investedGradient)"
              radius={chartConfig.borderRadius.bar}
              name="Invested"
            />
            <Bar
              dataKey="current"
              fill="url(#currentGradient)"
              radius={chartConfig.borderRadius.bar}
              name="Current Value"
            />
          </BarChart>
        </ChartContainer>
      </div>
    );
  }
);
