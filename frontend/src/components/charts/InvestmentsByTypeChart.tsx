import { memo } from "react";
import { Cell, Legend, Pie, PieChart, Tooltip } from "recharts";
import { chartConfig, getChartColor } from "../../config/chartConfig";
import type {
  ChartDataItem,
  ChartDataItemWithPercent,
} from "../../types/chart";
import {
  addPercentageToData,
  formatValueWithPercent,
} from "../../utils/chartUtils";
import { ChartContainer } from "../ui/ChartContainer";
import { ChartEmptyState } from "./ChartEmptyState";
import { CustomTooltip } from "./CustomTooltip";

interface InvestmentsByTypeChartProps {
  data: ChartDataItem[];
}

export const InvestmentsByTypeChart = memo(
  ({ data }: InvestmentsByTypeChartProps) => {
    if (data.length === 0) {
      return (
        <ChartEmptyState
          title="Investments by Type"
          message="Add investments to see the distribution across different asset types."
          icon="chart"
        />
      );
    }

    const total = data.reduce((sum, item) => sum + item.value, 0);

    const dataWithPercent = addPercentageToData(data);

    const tooltipFormatter = (
      value: number,
      name: string
    ): [string, string] => {
      return [formatValueWithPercent(value, total), name];
    };

    const legendFormatter = (value: string, entry: Record<string, unknown>) => {
      const payload = entry.payload as ChartDataItemWithPercent;
      return `${value} (${payload.percent}%)`;
    };

    return (
      <div
        className="bg-white rounded-xl shadow-lg p-6 transition-shadow duration-300 hover:shadow-xl"
        role="region"
        aria-label="Investments by Type Chart"
      >
        <h2
          className="text-xl font-semibold text-gray-800 mb-6"
          id="investments-by-type-title"
        >
          Investments by Type
        </h2>
        <ChartContainer height={350}>
          <PieChart aria-labelledby="investments-by-type-title">
            <Pie
              data={dataWithPercent}
              cx="50%"
              cy="45%"
              innerRadius={chartConfig.chart.pieChart.innerRadius}
              outerRadius={chartConfig.chart.pieChart.outerRadius}
              fill="#8884d8"
              dataKey="value"
              label={false}
              labelLine={false}
            >
              {dataWithPercent.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={getChartColor(index)} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip formatter={tooltipFormatter} />} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                paddingTop: `${chartConfig.spacing.legendPaddingTop}px`,
                fontSize: chartConfig.typography.legendText.fontSize,
                lineHeight: "1.5",
              }}
              iconType="circle"
              iconSize={10}
              formatter={legendFormatter}
            />
          </PieChart>
        </ChartContainer>
      </div>
    );
  }
);
