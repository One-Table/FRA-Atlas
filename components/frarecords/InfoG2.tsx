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

type SectorData = {
  sector: string;
  count: number;
};

const data: SectorData[] = [
  { sector: "Monitoring", count: 260 },
  { sector: "Education", count: 238 },
  { sector: "Tribal Life", count: 188 },
  { sector: "Art & Culture", count: 166 },
  { sector: "Ethnography", count: 151 },
  { sector: "Socio-economic", count: 148 },
  { sector: "Livelihood", count: 77 },
  { sector: "Monograph", count: 58 },
  { sector: "Health", count: 49 },
  { sector: "Data Science", count: 33 },
  { sector: "Forest Rights", count: 28 },
  { sector: "Demography", count: 19 },
  { sector: "Tradition", count: 19 },
  { sector: "Women", count: 17 }
];

const BAR_COLOR = "#a4bafe";
const LABEL_COLOR = "#222";

// YAxis custom tick for professional dashboard look
interface CustomTickProps {
  x?: number;
  y?: number;
  payload: { value: string };
}
const CustomYAxisTick: React.FC<CustomTickProps> = ({ x = 0, y = 0, payload }) => (
  <g transform={`translate(${x},${y})`}>
    <text
      x={0}
      y={0}
      dy={12}
      textAnchor="end"
      fill={LABEL_COLOR}
      fontWeight={600}
      fontSize={14}
      fontFamily="Segoe UI, Arial, sans-serif"
    >
      {payload.value}
    </text>
  </g>
);

const InfoG2: React.FC = () => (
  <div className="flex flex-col w-full h-96 bg-[#f8f9fd] rounded-md shadow-md border border-[#e2e8f0] px-8 py-6 overflow-x-auto">
    <div className="text-lg font-bold mb-1 text-[#1857b2]" style={{fontFamily: 'Segoe UI, Arial, sans-serif'}}>
      No. of Documents by Sector
    </div>
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 20, left: 120, bottom: 12 }}
        barGap={7}
      >
        <CartesianGrid stroke="#ebeef2" horizontal={false} />
        <XAxis
          type="number"
          axisLine={false}
          tickLine={false}
          fontSize={15}
          stroke="#2a334d"
          label={{ value: "No. of Documents", position: "insideBottom", fontWeight: 600, fontSize: 13 }}
        />
        <YAxis
          dataKey="sector"
          type="category"
          width={10}
          tick={<CustomYAxisTick />}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "#b1c1e6", opacity: 0.16 }}
          contentStyle={{ fontFamily: "Segoe UI", fontSize: 14, borderRadius: "8px", border: "1px solid #1957b2" }}
          formatter={(value: number) => [`${value} documents`, "No. of Documents"]}
          labelStyle={{ color: "#1857b2", fontWeight: "700" }}
          labelFormatter={(label: string) => `Sector: ${label}`}
        />
        <Bar
          dataKey="count"
          fill={BAR_COLOR}
          radius={[0, 10, 10, 0]}
          background={{ fill: "#edeef0" }}
          barSize={20}
          isAnimationActive={false}
        >
          <LabelList
            dataKey="count"
            position="right"
            formatter={(value: number) => `${value}`}
            fill={LABEL_COLOR}
            fontWeight={800}
            fontSize={15}
            offset={6}
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default InfoG2;
