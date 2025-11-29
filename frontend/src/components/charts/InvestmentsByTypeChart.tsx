import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { ChartContainer } from "../ui/ChartContainer";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

interface InvestmentsByTypeChartProps {
  data: Array<{ name: string; value: number }>;
}

export const InvestmentsByTypeChart = ({
  data,
}: InvestmentsByTypeChartProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Investments by Type
      </h2>
      <ChartContainer height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }): string =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ChartContainer>
    </div>
  );
};
