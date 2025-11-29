import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "../../utils/formatters";
import { ChartContainer } from "../ui/ChartContainer";

interface PortfolioValueChartProps {
  data: Array<{ month: string; invested: number; current: number }>;
}

export const PortfolioValueChart = ({ data }: PortfolioValueChartProps) => {
  if (data.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        Portfolio Value Over Time
      </h2>
      <ChartContainer height={400}>
        <LineChart
          data={data}
          margin={{ top: 10, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="month"
            angle={-45}
            textAnchor="end"
            height={80}
            interval="preserveStartEnd"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value) =>
              `$${
                value > 1000
                  ? `${(value / 1000).toFixed(1)}k`
                  : value.toLocaleString()
              }`
            }
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number): string => `$${formatCurrency(value)}`}
            labelStyle={{ color: "#000", fontWeight: 600 }}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          />
          <Legend wrapperStyle={{ paddingTop: "20px" }} />
          <Line
            type="monotone"
            dataKey="invested"
            stroke="#8884d8"
            strokeWidth={2.5}
            name="Cumulative Invested"
            dot={{ r: 4, fill: "#8884d8" }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="current"
            stroke="#82ca9d"
            strokeWidth={2.5}
            name="Cumulative Current Value"
            dot={{ r: 4, fill: "#82ca9d" }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};
