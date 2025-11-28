interface StatCardProps {
  title: string;
  value: string | number;
  valueColor?: "default" | "green" | "red";
}

export const StatCard = ({
  title,
  value,
  valueColor = "default",
}: StatCardProps) => {
  const colorClass =
    valueColor === "green"
      ? "text-green-600"
      : valueColor === "red"
      ? "text-red-600"
      : "text-gray-800";

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-2">
        {title}
      </h3>
      <p className={`text-xl font-bold ${colorClass}`}>{value}</p>
    </div>
  );
};
