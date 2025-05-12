"use client";

import {
	PieChart as RechartsPieChart,
	Pie,
	Cell,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts";
import { Card } from "@/components/ui/card";

const COLORS = [
	"hsl(var(--primary))",
	"hsl(var(--secondary))",
	"hsl(var(--destructive))",
	"hsl(var(--muted-foreground))",
	"hsl(var(--accent))",
];

interface PieChartProps {
	data: {
		name: string;
		value: number;
	}[];
}

export function PieChart({ data }: PieChartProps) {
	return (
		<div className="h-full w-full">
			<ResponsiveContainer width="100%" height="100%">
				<RechartsPieChart>
					<Pie
						data={data}
						cx="50%"
						cy="50%"
						labelLine={false}
						outerRadius={80}
						fill="#8884d8"
						dataKey="value"
						animationDuration={1500}
						animationEasing="ease-out">
						{data.map((entry, index) => (
							<Cell
								key={`cell-${index}`}
								fill={COLORS[index % COLORS.length]}
							/>
						))}
					</Pie>
					<Tooltip
						contentStyle={{
							backgroundColor: "hsl(var(--background))",
							borderColor: "hsl(var(--border))",
							borderRadius: "calc(var(--radius) - 2px)",
							boxShadow: "var(--shadow-md)",
						}}
					/>
					<Legend
						layout="horizontal"
						verticalAlign="bottom"
						align="center"
						wrapperStyle={{
							paddingTop: "20px",
							fontSize: "12px",
						}}
					/>
				</RechartsPieChart>
			</ResponsiveContainer>
		</div>
	);
}
