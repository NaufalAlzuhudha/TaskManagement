"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface DashboardChartsProps {
  statusData: { name: string; value: number; color: string }[];
  priorityData: { name: string; value: number; color: string }[];
}

export function DashboardCharts({
  statusData,
  priorityData,
}: DashboardChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="h-64 rounded-lg border border-border bg-card animate-pulse" />
        <div className="h-64 rounded-lg border border-border bg-card animate-pulse" />
      </div>
    );
  }

  const totalStatus = statusData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Status Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            Status Breakdown
          </CardTitle>
          <CardDescription>
            Distribusi tugas berdasarkan status pengerjaan saat ini
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          {totalStatus === 0 ? (
            <div className="flex h-48 items-center justify-center text-xs text-muted-foreground">
              Belum ada data tugas
            </div>
          ) : (
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "6px",
                      border: "1px solid #E4E4E7",
                      fontSize: "12px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    }}
                    cursor={{ fill: "rgba(0,0,0,0.03)" }}
                  />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Priority Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">
            Priority Distribution
          </CardTitle>
          <CardDescription>
            Proporsi tingkat kepentingan tugas (Low, Medium, High)
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          {totalStatus === 0 ? (
            <div className="flex h-48 items-center justify-center text-xs text-muted-foreground">
              Belum ada data tugas
            </div>
          ) : (
            <div className="h-48 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "6px",
                      border: "1px solid #E4E4E7",
                      fontSize: "12px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 pr-6">
                {priorityData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-xs">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground">{item.name}:</span>
                    <span className="font-medium text-foreground">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

