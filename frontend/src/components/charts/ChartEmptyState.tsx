import { memo } from "react";

interface ChartEmptyStateProps {
  title: string;
  message?: string;
  icon?: "chart" | "data" | "filter";
}

const icons = {
  chart: (
    <svg
      className="w-16 h-16 text-gray-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
      />
    </svg>
  ),
  data: (
    <svg
      className="w-16 h-16 text-gray-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
      />
    </svg>
  ),
  filter: (
    <svg
      className="w-16 h-16 text-gray-300"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
      />
    </svg>
  ),
};

export const ChartEmptyState = memo(
  ({ title, message, icon = "data" }: ChartEmptyStateProps) => {
    const defaultMessage = "No data available to display this chart.";

    return (
      <div
        className="bg-white rounded-xl shadow-lg p-6 transition-shadow duration-300 hover:shadow-xl"
        role="region"
        aria-label={`${title} - Empty State`}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6">{title}</h2>
        <div
          className="flex flex-col items-center justify-center py-12 px-4"
          role="status"
          aria-live="polite"
        >
          <div className="mb-4">{icons[icon]}</div>
          <p className="text-gray-500 text-center text-base font-medium mb-2">
            No Data Available
          </p>
          <p className="text-gray-400 text-center text-sm max-w-md">
            {message || defaultMessage}
          </p>
        </div>
      </div>
    );
  }
);

ChartEmptyState.displayName = "ChartEmptyState";
