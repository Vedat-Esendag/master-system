"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface WeeklyActivityProps {
  data: Array<{
    day: string;
    standing: number;
    total: number;
  }>;
}

export default function WeeklyActivity({ data }: WeeklyActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((day) => (
            <div key={day.day} className="flex items-center space-x-4">
              <div className="w-12 text-sm text-gray-500">{day.day}</div>
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-green-500 rounded-full h-2.5" 
                  style={{ 
                    width: `${(day.standing / day.total) * 100}%`,
                    transition: 'width 0.5s ease-in-out'
                  }}
                />
              </div>
              <div className="text-sm text-gray-500">
                {day.standing}h / {day.total}h
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
