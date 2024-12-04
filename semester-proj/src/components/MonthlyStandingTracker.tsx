"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { format } from 'date-fns'
import { useMemo } from 'react'

interface MonthlyStandingTrackerProps {
  days: Date[];
}

export default function MonthlyStandingTracker({ days }: MonthlyStandingTrackerProps) {
  const standingLevels = useMemo(() => days.map((_, index) => {
    const levels = [
      'bg-gray-100 dark:bg-gray-800 opacity-30',
      'bg-green-100 dark:bg-green-800 opacity-50',
      'bg-green-300 dark:bg-green-600 opacity-70',
      'bg-green-400 dark:bg-green-500 opacity-80',
      'bg-green-500 dark:bg-green-400 opacity-100'
    ]
    return levels[index % levels.length]
  }), [days]);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Monthly Standing Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
          <div className="grid grid-cols-7 gap-1 max-w-xl w-full">
            {days.map((day, index) => (
              <div 
                key={day.toISOString()} 
                className="flex flex-col items-center"
              >
                <div 
                  className={cn(
                    "w-4 h-4 rounded-sm transition-all duration-300 ease-in-out hover:scale-110", 
                    standingLevels[index]
                  )}
                  title={`${format(day, 'EEEE, MMMM d')}`}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-center text-xs text-gray-500 mt-2">
          <div className="flex items-center max-w-xl w-full justify-between">
            <span className="flex items-center">
              <div className="w-3 h-3 mr-1 bg-gray-100 dark:bg-gray-800 rounded-sm"></div>
              Less Active
            </span>
            <span className="flex items-center">
              <div className="w-3 h-3 mr-1 bg-green-500 dark:bg-green-400 rounded-sm"></div>
              More Active
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
