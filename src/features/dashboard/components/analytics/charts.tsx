"use client";

import { formatCurrency, formatCurrencyValue } from "@/features/dashboard/lib";
import { Currency } from "@prisma/client";
import { PieChart as PieChartIcon, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CustomTooltip } from "./tooltip";
const COLORS = [
  "#FF7A00",
  "#FF9A3D",
  "#FFB366",
  "#FFCC99",
  "#FFE5CC",
  "#FFF2E6",
];

export interface MonthlySpendingChartProps {
  data: Array<{ month: string; amount: number }>;
  defaultCurrency: Currency;
}

export const MonthlySpendingChart = ({
  data,
  defaultCurrency,
}: MonthlySpendingChartProps) => (
  <div className="bg-card rounded-lg shadow-sm p-6">
    <div className="flex items-center mb-4">
      <TrendingUp className="h-5 w-5 text-primary mr-2" />
      <h3 className="text-lg font-semibold">Monthly Spending History</h3>
    </div>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(value) => formatCurrency(value, defaultCurrency)}
          />
          <Tooltip
            content={
              <CustomTooltip
                formatter={(value) =>
                  formatCurrencyValue(value, defaultCurrency)
                }
              />
            }
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#FF7A00"
            fill="#FF7A00"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export interface CategoryBreakdownChartProps {
  data: Array<{ name: string; value: number }>;
  defaultCurrency: Currency;
}

export const CategoryBreakdownChart = ({
  data,
  defaultCurrency,
}: CategoryBreakdownChartProps) => (
  <div className="bg-card rounded-lg shadow-sm p-6">
    <div className="flex items-center mb-4">
      <PieChartIcon className="h-5 w-5 text-primary mr-2" />
      <h3 className="text-lg font-semibold">Spending by Category</h3>
    </div>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#FF7A00"
            dataKey="value"
            label={({
              cx,
              cy,
              midAngle,
              innerRadius,
              outerRadius,
              percent,
              name,
            }) => {
              const RADIAN = Math.PI / 180;
              const radius =
                25 + innerRadius + (outerRadius - innerRadius) * 0.5;
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);

              return (
                <text
                  x={x}
                  y={y}
                  fill="#888888"
                  textAnchor={x > cx ? "start" : "end"}
                  dominantBaseline="central"
                  fontSize={12}
                >
                  {`${name} (${(percent * 100).toFixed(0)}%)`}
                </text>
              );
            }}
          >
            {data.map((_entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            content={
              <CustomTooltip
                formatter={(value) =>
                  formatCurrencyValue(value, defaultCurrency)
                }
              />
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export interface ProjectedSpendingChartProps {
  data: Array<{ month: string; amount: number }>;
  defaultCurrency: Currency;
}

export const ProjectedSpendingChart = ({
  data,
  defaultCurrency,
}: ProjectedSpendingChartProps) => (
  <div className="bg-card rounded-lg shadow-sm p-6">
    <div className="flex items-center mb-4">
      <TrendingUp className="h-5 w-5 text-primary mr-2" />
      <h3 className="text-lg font-semibold">Projected Spending</h3>
    </div>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(value) => formatCurrency(value, defaultCurrency)}
          />
          <Tooltip
            content={
              <CustomTooltip
                formatter={(value) =>
                  formatCurrencyValue(value, defaultCurrency)
                }
              />
            }
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke="#4F46E5"
            fill="#4F46E5"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);
