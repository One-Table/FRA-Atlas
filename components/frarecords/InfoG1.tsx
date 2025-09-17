"use client";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

// Data type
type ChartData = {
  type: string;
  count: number;
};

const data: ChartData[] = [
  { type: "Book", count: 474 },
  { type: "Research", count: 432 },
  { type: "Report", count: 325 },
  { type: "Hand Book", count: 141 },
  { type: "Journal", count: 130 },
  { type: "Dissertation", count: 36 },
];

// Y-Axis Tick type formatting
interface CustomTickProps {
  x?: number;
  y?: number;
  payload: {
    value: string;
  };
}

const CustomYAxisTick: React.FC<CustomTickProps> = ({ x = 0, y = 0, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <text
      x={0}
      y={0}
      dy={2}
      textAnchor="end"
      fill="#233e80" // government blue
      fontWeight={700}
      fontSize={16}
      fontFamily="Segoe UI, Arial, sans-serif"
    >
      {payload.value}
    </text>
  </g>
);

const InfoG1: React.FC = () => (
  <div className="flex flex-col w-full h-72 bg-[#f8f9fd] shadow-md border border-[#e2e8f0] px-8 py-6">
    <div className="text-xl font-bold mb-2 text-[#1957b2]" style={{fontFamily: 'Segoe UI, Arial, sans-serif'}}>
      Document Type Distribution
    </div>
    
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 2, right: 20, left: 120, bottom: 8 }}
        barGap={6}
      >
        <CartesianGrid stroke="#ebeef2" horizontal={false} />
        <XAxis
          type="number"
          axisLine={{ stroke: "#233e80", strokeWidth: 1 }}
          tickLine={false}
          domain={[0, 600]}
          interval={0}
          fontSize={15}
          stroke="#2a334d"
        />
        <YAxis
            dataKey="type"
            type="category"
            width={10} 
            tick={<CustomYAxisTick />}
            axisLine={{ stroke: "#233e80", strokeWidth: 0.5 }}
            tickLine={false}
          />
        <Tooltip
          cursor={{ fill: "#cad6fa", opacity: 0.15 }}
          contentStyle={{ fontFamily: "Segoe UI", borderRadius: "8px", border: "1px solid #1957b2" }}
          formatter={(value: number) => [`${value} documents`, "No. of Documents"]}
          labelStyle={{ color: "#1957b2", fontWeight: "700" }}
          labelFormatter={(label: string) => `Document Type: ${label}`}
        />
        <Bar
          dataKey="count"
          fill="#7aa8e6"
          radius={[0, 10, 10, 0]}
          background={{ fill: "#edeef0" }}
          barSize={22}
          isAnimationActive={true}
        >
          <LabelList
            dataKey="count"
            position="right"
            formatter={(value: number) => `${value}`}
            fill="#1e2838"
            fontWeight={700}
            fontSize={16}
          />
        </Bar>
      </BarChart>
      <div className="mb-2 text-base text-[#222] font-medium" style={{fontFamily: 'Segoe UI, Arial, sans-serif'}}>
      Total documents: <span className="font-bold">1553</span>
    </div>
    </ResponsiveContainer>
  </div>
);

export default InfoG1;
