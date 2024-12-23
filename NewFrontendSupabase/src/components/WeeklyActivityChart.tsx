'use client'

import { Card } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

interface WeeklyActivityData {
  day: string
  minutes: number
  uniqueUsers: number
  averagePerUser: number
  peakHour: number
}

interface StandingDistribution {
  name: string
  percentage: number
  averageSession: number
  totalHours: number
}

interface Props {
  weeklyData: WeeklyActivityData[]
  distributionData: StandingDistribution[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export function WeeklyActivityChart({ weeklyData, distributionData }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Weekly Standing Activity</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" orientation="left" stroke="#82ca9d" />
              <YAxis yAxisId="right" orientation="right" stroke="#8884d8" />
              <Tooltip />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="minutes"
                name="Standing Minutes"
                fill="#82ca9d"
              />
              <Bar
                yAxisId="right"
                dataKey="uniqueUsers"
                name="Active Users"
                fill="#8884d8"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4">Standing Time Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name} (${percentage}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="percentage"
              >
                {distributionData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name, props) => [
                  `${props.payload.totalHours}h (${value}%)`,
                  props.payload.name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 space-y-2">
          {distributionData.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{item.name}</span>
              </div>
              <div className="text-gray-500">
                {item.totalHours}h ({item.percentage}%)
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
} 