export interface ChartDataItem {
  name: string;
  value: number;
}

export interface ChartDataItemWithPercent extends ChartDataItem {
  percent: string;
}

export interface LegendPayload {
  value: string;
  type?: string;
  id?: string;
  color?: string;
  payload: ChartDataItemWithPercent & {
    strokeDasharray?: string | number;
  };
}

export interface TooltipPayload {
  name: string;
  value: number;
  color: string;
  payload?: ChartDataItem & Record<string, unknown>;
  dataKey?: string;
}
