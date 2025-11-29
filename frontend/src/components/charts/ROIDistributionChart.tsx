import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartContainer } from "../ui/ChartContainer";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

interface ROIDistributionChartProps {
  data: Array<{ range: string; count: number; min: number; max: number }>;
}

export const ROIDistributionChart = ({ data }: ROIDistributionChartProps) => {
  if (data.length === 0) return null;

  const getColor = (entry: { range: string; min: number }) => {
    if (entry.range.includes("-") && !entry.range.startsWith("-50")) {
      return COLORS[3];
    } else if (entry.range.includes("-")) {
      return "#ef4444";
    } else if (entry.range.includes(">")) {
      return "#10b981";
    } else if (entry.min >= 25) {
      return "#22c55e";
    }
    return COLORS[2];
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        ROI Distribution
      </h2>
      <ChartContainer height={300}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis
            type="category"
            dataKey="range"
            width={110}
            tick={{ fontSize: 11 }}
          />
          <Tooltip
            formatter={(value: number): string =>
              `${value} investment${value !== 1 ? "s" : ""}`
            }
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`roi-cell-${index}`} fill={getColor(entry)} />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};
