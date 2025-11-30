export const chartConfig = {
  colors: {
    primary: "#3b82f6", // Blue
    secondary: "#8b5cf6", // Purple
    success: "#10b981", // Green
    danger: "#ef4444", // Red
    warning: "#f59e0b", // Orange
    info: "#06b6d4", // Cyan
    pink: "#ec4899", // Pink
    neutral: "#6b7280", // Gray

    chartPalette: [
      "#3b82f6",
      "#8b5cf6",
      "#ec4899",
      "#f59e0b",
      "#10b981",
      "#06b6d4",
    ],

    positive: "#10b981",
    negative: "#ef4444",

    border: "#e5e7eb",
    grid: "#e5e7eb",
    text: "#6b7280",
    textDark: "#1f2937",
    background: "#ffffff",
  },

  typography: {
    chartTitle: {
      fontSize: "20px",
      fontWeight: 600,
    },
    axisLabel: {
      fontSize: 12,
      fontWeight: 400,
    },
    tooltipHeader: {
      fontSize: "14px",
      fontWeight: 600,
    },
    tooltipValue: {
      fontSize: "13px",
      fontWeight: 400,
    },
    legendText: {
      fontSize: "12px",
      fontWeight: 400,
    },
  },

  spacing: {
    containerPadding: 24,
    chartMargins: {
      top: 20,
      right: 30,
      left: 20,
      bottom: 80,
    },
    chartMarginsHorizontal: {
      top: 20,
      right: 30,
      left: 140,
      bottom: 20,
    },
    gridGap: 24,
    tooltipPadding: "12px 16px",
    legendPaddingTop: 20,
  },

  shadows: {
    card: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    cardHover:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    tooltip:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  },

  borderRadius: {
    card: 12,
    tooltip: 8,
    bar: [8, 8, 0, 0] as [number, number, number, number],
  },

  chart: {
    strokeWidth: {
      line: 3,
      grid: 1,
    },
    dotSize: {
      default: 5,
      active: 8,
    },
    pieChart: {
      innerRadius: 60,
      outerRadius: 100,
    },
    gridOpacity: 0.5,
    animationDuration: 300,
  },

  gradients: {
    tooltip:
      "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.95) 100%)",
    barPrimary: (color: string) => ({
      id: "barGradient",
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1",
      stops: [
        { offset: "0%", color, opacity: 1 },
        { offset: "100%", color, opacity: 0.7 },
      ],
    }),
    areaFill: (color: string, opacity: number = 0.3) => ({
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1",
      stops: [
        { offset: "5%", color, opacity },
        { offset: "95%", color, opacity: 0 },
      ],
    }),
  },
};

export const getChartColor = (index: number): string => {
  return chartConfig.colors.chartPalette[
    index % chartConfig.colors.chartPalette.length
  ]!;
};

export const getValueColor = (value: number): string => {
  return value >= 0 ? chartConfig.colors.positive : chartConfig.colors.negative;
};
