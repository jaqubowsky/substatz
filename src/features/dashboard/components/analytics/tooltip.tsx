"use client";

export interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    payload?: Record<string, unknown>;
  }>;
  label?: string;
  formatter?: (val: number) => [string, string] | Array<string>;
}

export const CustomTooltip = ({
  active,
  payload,
  label,
  formatter,
}: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    const formattedValue = formatter ? formatter(val) : val;

    const additionalInfo = payload[0].payload;
    const startDate =
      additionalInfo && "startDate" in additionalInfo
        ? (additionalInfo.startDate as string)
        : undefined;

    return (
      <div className="bg-white p-3 border border-gray-200 rounded shadow-sm">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-sm text-primary font-semibold">
          {Array.isArray(formattedValue) ? formattedValue[0] : formattedValue}
        </p>
        {startDate && (
          <p className="text-xs text-muted-foreground">Started: {startDate}</p>
        )}
      </div>
    );
  }

  return null;
};
