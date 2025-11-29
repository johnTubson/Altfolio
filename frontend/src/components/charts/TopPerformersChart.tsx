import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../../utils/formatters";
import { ChartContainer } from "../ui/ChartContainer";

interface TopPerformersChartProps {
  data: Array<{
    name: string;
    fullName: string;
    profitLoss: number;
    roi: number;
  }>;
}

export const TopPerformersChart = ({ data }: TopPerformersChartProps) => {
  if (data.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Top Performers by Profit/Loss
      </h2>
      <ChartContainer height={350}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            type="number"
            tick={{ fontSize: 12 }}
            domain={["dataMin", "dataMax"]}
            tickFormatter={(value) => {
              const absValue = Math.abs(value);
              const sign = value >= 0 ? "" : "-";
              const formatted =
                absValue > 1000
                  ? `${(absValue / 1000).toFixed(1)}k`
                  : absValue.toLocaleString();
              return `${sign}$${formatted}`;
            }}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={115}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(
              value: number,
              _name: string,
              props: any
            ): [string, string] => {
              const roi = props.payload.roi ?? 0;
              return [
                `$${formatCurrency(value)} (${roi >= 0 ? "+" : ""}${roi.toFixed(
                  2
                )}%)`,
                "Profit/Loss",
              ];
            }}
            labelFormatter={(label: string) => {
              const fullEntry = data.find((e) => e.name === label);
              return fullEntry?.fullName || label;
            }}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          />
          <Bar dataKey="profitLoss" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`profit-cell-${index}`}
                fill={entry.profitLoss >= 0 ? "#10b981" : "#ef4444"}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};
