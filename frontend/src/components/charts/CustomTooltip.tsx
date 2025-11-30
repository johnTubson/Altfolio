import { chartConfig } from "../../config/chartConfig";
import type { TooltipPayload } from "../../types/chart";

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
  formatter?: (
    value: number,
    name: string,
    payload: TooltipPayload
  ) => [string, string];
  labelFormatter?: (label: string) => string;
}

export const CustomTooltip = ({
  active,
  payload,
  label,
  formatter,
  labelFormatter,
}: CustomTooltipProps) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const formattedLabel =
    labelFormatter && label ? labelFormatter(label) : label;

  return (
    <div
      className="custom-tooltip"
      style={{
        background: chartConfig.gradients.tooltip,
        border: `1px solid ${chartConfig.colors.border}`,
        borderRadius: `${chartConfig.borderRadius.tooltip}px`,
        padding: chartConfig.spacing.tooltipPadding,
        boxShadow: chartConfig.shadows.tooltip,
        minWidth: "150px",
        animation: "fadeIn 0.2s ease-in-out",
      }}
    >
      {formattedLabel && (
        <div
          style={{
            fontSize: chartConfig.typography.tooltipHeader.fontSize,
            fontWeight: chartConfig.typography.tooltipHeader.fontWeight,
            color: chartConfig.colors.textDark,
            marginBottom: "8px",
            paddingBottom: "8px",
            borderBottom: `1px solid ${chartConfig.colors.border}`,
          }}
        >
          {formattedLabel}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
        {payload.map((entry, index) => {
          let displayName = entry.name;
          let displayValue: string | number = entry.value;

          if (formatter) {
            const payloadData: TooltipPayload = {
              name: entry.name,
              value: entry.value,
              color: entry.color,
              payload: entry.payload,
              dataKey: entry.dataKey,
            };
            const [formattedValue, formattedName] = formatter(
              entry.value,
              entry.name,
              payloadData
            );
            displayValue = formattedValue;
            displayName = formattedName;
          }

          return (
            <div
              key={`tooltip-item-${index}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "12px",
                  height: "12px",
                  borderRadius: "50%",
                  backgroundColor: entry.color,
                  flexShrink: 0,
                }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flex: 1,
                  gap: "12px",
                }}
              >
                <span
                  style={{
                    fontSize: chartConfig.typography.tooltipValue.fontSize,
                    color: chartConfig.colors.text,
                  }}
                >
                  {displayName}:
                </span>
                <span
                  style={{
                    fontSize: chartConfig.typography.tooltipValue.fontSize,
                    fontWeight: 600,
                    color: chartConfig.colors.textDark,
                  }}
                >
                  {displayValue}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
