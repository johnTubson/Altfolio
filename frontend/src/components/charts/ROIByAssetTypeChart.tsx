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

interface ROIByAssetTypeChartProps {
  data: Array<{ name: string; roi: number; count: number }>;
}

export const ROIByAssetTypeChart = ({ data }: ROIByAssetTypeChartProps) => {
  if (data.length === 0) return null;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        ROI Comparison by Asset Type
      </h2>
      <ChartContainer height={350}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(value) =>
              `${value >= 0 ? "+" : ""}${value.toFixed(0)}%`
            }
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(
              value: number,
              _name: string,
              props: any
            ): [string, string] => {
              const count = props.payload.count ?? 0;
              return [
                `${value >= 0 ? "+" : ""}${value.toFixed(
                  2
                )}% (${count} investment${count !== 1 ? "s" : ""})`,
                "Average ROI",
              ];
            }}
            contentStyle={{
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          />
          <Bar dataKey="roi" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`roi-type-cell-${index}`}
                fill={entry.roi >= 0 ? "#10b981" : "#ef4444"}
              />
            ))}
          </Bar>
        </BarChart>
      </ChartContainer>
    </div>
  );
};
