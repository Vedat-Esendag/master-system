"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns'
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { useMemo, Suspense } from 'react'
import dynamic from 'next/dynamic'

// Dynamically import heavy components
const WeeklyActivityLoading = () => (
  <Card>
    <CardHeader>
      <div className="h-6 w-32 bg-muted rounded" />
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-4">
            <div className="w-12 h-4 bg-muted rounded" />
            <div className="flex-1 h-2.5 bg-muted rounded-full" />
            <div className="w-20 h-4 bg-muted rounded" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const MonthlyStandingTrackerLoading = () => (
  <Card className="mt-8 h-[300px] animate-pulse">
    <CardHeader>
      <div className="h-6 w-48 bg-muted rounded" />
    </CardHeader>
    <CardContent className="flex justify-center">
      <div className="h-[200px] w-full max-w-xl bg-muted rounded" />
    </CardContent>
  </Card>
);

const MonthlyStandingTracker = dynamic(() => import('@/components/MonthlyStandingTracker'), {
  ssr: false,
  loading: MonthlyStandingTrackerLoading
});

const WeeklyActivity = dynamic(() => import('@/components/WeeklyActivity'), {
  ssr: false,
  loading: WeeklyActivityLoading
});

export default function MainDashboard() {
  // Memoize data calculations
  const weeklyActivityData = useMemo(() => [
    { day: 'Mon', standing: 2, total: 8 },
    { day: 'Tue', standing: 3, total: 8 },
    { day: 'Wed', standing: 4, total: 8 },
    { day: 'Thu', standing: 1, total: 8 },
    { day: 'Fri', standing: 5, total: 8 },
  ], []);

  const daysInMonth = useMemo(() => {
    const currentMonth = new Date()
    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(currentMonth)),
      end: endOfWeek(endOfMonth(currentMonth))
    })
  }, []);

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
          <Suspense>
            <WeeklyActivity data={weeklyActivityData} />
          </Suspense>

          <Card>
            <CardContent className="space-y-4 p-6">
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg text-center">
                <h2 className="text-xl font-bold text-yellow-800">You should stand up.</h2>
              </div>
              <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                <h3 className="text-sm text-gray-600">Monthly Hours Standing</h3>
                <p className="text-2xl font-bold text-blue-800">33h 32min</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <h4 className="text-sm text-gray-600">Sitting</h4>
                  <p className="text-lg font-bold">40 min</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-600">Standing</h4>
                  <p className="text-lg font-bold">3h 20min</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-600">Breaks</h4>
                  <p className="text-lg font-bold">20 min</p>
                </div>
              </div>
            </CardContent>
          </Card>

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

        <Suspense>
          <MonthlyStandingTracker days={daysInMonth} />
        </Suspense>
      </main>
    </div>
  )
}
