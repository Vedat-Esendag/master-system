"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "Jan", desktop: 2420, mobile: 1800, tablet: 960 },
  { month: "Feb", desktop: 3140, mobile: 2400, tablet: 1200 },
  { month: "Mar", desktop: 2870, mobile: 2100, tablet: 1450 },
  { month: "Apr", desktop: 3300, mobile: 2800, tablet: 1680 },
  { month: "May", desktop: 3900, mobile: 3200, tablet: 1900 },
  { month: "Jun", desktop: 4200, mobile: 3600, tablet: 2100 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(221 83% 53%)",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(142 71% 45%)",
  },
  tablet: {
    label: "Tablet",
    color: "hsl(292 76% 54%)",
  },
} satisfies ChartConfig

export function ChartDemoFrederik() {
  return (
    <ChartContainer config={chartConfig} className="min-h-[400px] w-full">
      <BarChart 
        data={chartData}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        accessibilityLayer
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis 
          dataKey="month" 
          tickLine={false}
          axisLine={false}
        />
        <YAxis 
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value / 1000}k`}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar 
          dataKey="desktop" 
          fill="var(--color-desktop)" 
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        <Bar 
          dataKey="mobile" 
          fill="var(--color-mobile)" 
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
        <Bar 
          dataKey="tablet" 
          fill="var(--color-tablet)" 
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ChartContainer>
  )
} 