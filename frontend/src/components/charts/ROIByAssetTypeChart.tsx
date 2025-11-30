import { memo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { chartConfig, getValueColor } from "../../config/chartConfig";
import {
  formatROIAxisLabel,
  formatROIPercent,
  pluralize,
} from "../../utils/chartUtils";
import { ChartContainer } from "../ui/ChartContainer";
import { ChartEmptyState } from "./ChartEmptyState";
import { CustomTooltip } from "./CustomTooltip";

interface ROIByAssetTypeChartProps {
  data: { name: string; roi: number; count: number }[];
}

interface TooltipFormatterProps {
  payload?: { name: string; roi: number; count: number };
}

export const ROIByAssetTypeChart = memo(
  ({ data }: ROIByAssetTypeChartProps) => {
    if (data.length === 0) {
      return (
        <ChartEmptyState
          title="ROI Comparison by Asset Type"
          message="Add investments to compare return on investment across different asset types."
          icon="chart"
        />
      );
    }

    return (
      <div
        className="bg-white rounded-xl shadow-lg p-6 transition-shadow duration-300 hover:shadow-xl"
        role="region"
        aria-label="ROI Comparison by Asset Type Chart"
      >
        <h2
          className="text-xl font-semibold text-gray-800 mb-6"
          id="roi-by-asset-type-title"
        >
          ROI Comparison by Asset Type
        </h2>
        <ChartContainer height={350}>
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            aria-labelledby="roi-by-asset-type-title"
          >
            <defs>
              {data.map((entry, index) => {
                const color = getValueColor(entry.roi);
                const gradient = chartConfig.gradients.barPrimary(color);
                return (
                  <linearGradient
                    key={`gradient-${index}`}
                    id={`barGradient-${index}`}
                    x1={gradient.x1}
                    y1={gradient.y1}
                    x2={gradient.x2}
                    y2={gradient.y2}
                  >
                    {gradient.stops.map((stop, stopIndex) => (
                      <stop
                        key={stopIndex}
                        offset={stop.offset}
                        stopColor={stop.color}
                        stopOpacity={stop.opacity}
                      />
                    ))}
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
              tickFormatter={formatROIAxisLabel}
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
                _name: string,
                props: TooltipFormatterProps
              ): [string, string] => {
                const count = props.payload?.count ?? 0;
                return [
                  `${formatROIPercent(value)} (${count} ${pluralize(
                    count,
                    "investment"
                  )})`,
                  "Average ROI",
                ];
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
              dataKey="roi"
              radius={chartConfig.borderRadius.bar}
              name="Average ROI"
            >
              {data.map((_entry, index) => (
                <Cell
                  key={`roi-type-cell-${index}`}
                  fill={`url(#barGradient-${index})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </div>
    );
  }
);
