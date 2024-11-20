"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns'
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

export default function MainDashboard() {
  // Bar Chart Data (using simple data structure)
  const weeklyActivityData = [
    { day: 'Mon', standing: 2, total: 8 },
    { day: 'Tue', standing: 3, total: 8 },
    { day: 'Wed', standing: 4, total: 8 },
    { day: 'Thu', standing: 1, total: 8 },
    { day: 'Fri', standing: 5, total: 8 },
  ]

  // Monthly Standing Tracker Data
  const currentMonth = new Date()
  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth))
  })

  const getStandingLevel = (index: number) => {
    const levels = [
      'bg-gray-100 dark:bg-gray-800 opacity-30',   // No standing
      'bg-green-100 dark:bg-green-800 opacity-50', // Low standing
      'bg-green-300 dark:bg-green-600 opacity-70', // Medium standing
      'bg-green-400 dark:bg-green-500 opacity-80', // High standing
      'bg-green-500 dark:bg-green-400 opacity-100'  // Very high standing
    ]
    
    // Pseudo-random standing simulation
    const standing = Math.floor(Math.random() * levels.length)
    return levels[standing]
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Main Dashboard</h1>
          <Button variant="outline" size="sm">
            Today <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Graph Section (Top Left) */}
          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyActivityData.map((day) => (
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

          {/* Reminder Section (Top Right) */}
          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
                <h2 className="text-xl font-bold text-yellow-800">You should stand up.</h2>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="text-sm text-gray-600">Monthly Hours Standing</h3>
                <p className="text-2xl font-bold text-blue-800">33h 32min 2s</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Daily Status Section (Middle Left) */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <h4 className="text-sm text-gray-600">Sitting</h4>
                  <p className="text-lg font-bold">40 min 2s</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-600">Standing</h4>
                  <p className="text-lg font-bold">3h 20min 6s</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-600">Breaks</h4>
                  <p className="text-lg font-bold">20 min</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Insights */}
          <Card>
            <CardHeader>
              <CardTitle>Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Average Standing Time</span>
                  <span className="font-bold">2h 15min</span>
                </div>
                <div className="flex justify-between">
                  <span>Longest Standing Streak</span>
                  <span className="font-bold">5 days</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Standing Tracker */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Monthly Standing Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <div className="grid grid-cols-7 gap-1 max-w-xl w-full">
                {daysInMonth.map((day, index) => (
                  <div 
                    key={day.toISOString()} 
                    className="flex flex-col items-center"
                  >
                    <div 
                      className={cn(
                        "w-4 h-4 rounded-sm transition-all duration-300 ease-in-out hover:scale-110", 
                        getStandingLevel(index)
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
      </main>
    </div>
  )
}
