"use client";

import {
	BarChart as RechartsBarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";

interface BarChartProps {
	data: {
		name: string;
		value: number;
	}[];
}

export function BarChart({ data }: BarChartProps) {
	return (
		<div className="h-full w-full">
			<ResponsiveContainer width="100%" height="100%">
				<RechartsBarChart
					data={data}
					margin={{
						top: 5,
						right: 10,
						left: 10,
						bottom: 5,
					}}>
					<CartesianGrid strokeDasharray="3 3" className="opacity-30" />
					<XAxis
						dataKey="name"
						stroke="#888888"
						fontSize={12}
						tickLine={false}
						axisLine={false}
					/>
					<YAxis
						stroke="#888888"
						fontSize={12}
						tickLine={false}
						axisLine={false}
					/>
					<Tooltip
						contentStyle={{
							backgroundColor: "hsl(var(--background))",
							borderColor: "hsl(var(--border))",
							borderRadius: "calc(var(--radius) - 2px)",
							boxShadow: "var(--shadow-md)",
						}}
					/>
					<Bar
						dataKey="value"
						fill="hsl(var(--primary))"
						radius={[4, 4, 0, 0]}
						animationDuration={1500}
					/>
				</RechartsBarChart>
			</ResponsiveContainer>
		</div>
	);
}
