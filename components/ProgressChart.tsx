"use client";

import type { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import type { ProgressPoint } from "@/lib/types";

interface ProgressChartProps {
  data: ProgressPoint[];
}

export function ProgressChart({ data }: ProgressChartProps) {
  const tooltipFormatter = (value: ValueType | undefined, key: NameType | undefined) => {
    const numericValue = typeof value === "number" ? value : Number(value ?? 0);
    return key === "accuracy" ? [`${Math.round(numericValue)}%`, "Precisao"] : [numericValue, "Tentativas"];
  };

  const tooltipLabelFormatter = (value: unknown) => {
    if (typeof value !== "string") {
      return "";
    }

    return new Date(value).toLocaleDateString("pt-BR");
  };

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid stroke="#1e293b" strokeDasharray="4 4" />
          <XAxis
            dataKey="date"
            stroke="#64748b"
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            tickFormatter={(value: string) => value.slice(5)}
          />
          <YAxis
            domain={[0, 100]}
            stroke="#64748b"
            tick={{ fontSize: 12, fill: "#94a3b8" }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip
            formatter={tooltipFormatter}
            labelFormatter={tooltipLabelFormatter}
            contentStyle={{
              backgroundColor: "#0b1220",
              borderColor: "#1e293b",
              borderRadius: 16,
              color: "#f8fafc",
            }}
            itemStyle={{ color: "#f8fafc" }}
            labelStyle={{ color: "#cbd5e1" }}
          />
          <Line
            type="monotone"
            dataKey="accuracy"
            stroke="#22d3ee"
            strokeWidth={3}
            dot={{ r: 2, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
