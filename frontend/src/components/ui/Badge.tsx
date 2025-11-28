interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "blue" | "gray";
  className?: string;
}

export const Badge = ({
  children,
  variant = "default",
  className = "",
}: BadgeProps) => {
  const variantClass =
    variant === "blue"
      ? "bg-blue-100 text-blue-800"
      : variant === "gray"
      ? "bg-gray-100 text-gray-800"
      : "bg-gray-100 text-gray-800";

  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${variantClass} ${className}`}
    >
      {children}
    </span>
  );
};
