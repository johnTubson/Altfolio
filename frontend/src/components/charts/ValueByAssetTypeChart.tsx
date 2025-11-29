import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "../ui/ChartContainer";

interface ValueByAssetTypeChartProps {
  data: Array<{ name: string; invested: number; current: number }>;
}

export const ValueByAssetTypeChart = ({ data }: ValueByAssetTypeChartProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Value by Asset Type
      </h2>
      <ChartContainer height={300}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
          <YAxis
            tickFormatter={(value) =>
              `$${
                value > 1000
                  ? `${(value / 1000).toFixed(0)}k`
                  : value.toLocaleString()
              }`
            }
          />
          <Tooltip
            formatter={(value: number): string => `$${value.toLocaleString()}`}
          />
          <Legend />
          <Bar dataKey="invested" fill="#8884d8" name="Invested" />
          <Bar dataKey="current" fill="#82ca9d" name="Current Value" />
        </BarChart>
      </ChartContainer>
    </div>
  );
};
