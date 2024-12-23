'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { WeeklyActivityChart } from '@/components/WeeklyActivityChart'
import {
  fetchEmployeeCount,
  fetchActiveDesks,
  fetchAverageStandingTime,
  fetchWeeklyGrowth,
  fetchWeeklyActivity,
  fetchStandingDistribution
} from '@/lib/queries'

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

export default function Home() {
  const { user } = useUser()
  const [employeeCount, setEmployeeCount] = useState<number>(0)
  const [activeDesks, setActiveDesks] = useState<number>(0)
  const [averageStandingTime, setAverageStandingTime] = useState<number>(0)
  const [weeklyGrowth, setWeeklyGrowth] = useState<number>(0)
  const [weeklyActivity, setWeeklyActivity] = useState<WeeklyActivityData[]>([])
  const [standingDistribution, setStandingDistribution] = useState<StandingDistribution[]>([])

  useEffect(() => {
    async function loadData() {
      const [
        empCount,
        actDesks,
        avgStanding,
        wGrowth,
        wActivity,
        sDistribution
      ] = await Promise.all([
        fetchEmployeeCount(),
        fetchActiveDesks(),
        fetchAverageStandingTime(),
        fetchWeeklyGrowth(),
        fetchWeeklyActivity(),
        fetchStandingDistribution()
      ])

      setEmployeeCount(Number(empCount))
      setActiveDesks(Number(actDesks))
      setAverageStandingTime(Number(avgStanding))
      setWeeklyGrowth(Number(wGrowth))
      setWeeklyActivity(wActivity.map(item => ({
        ...item,
        peakHour: Number(item.peakHour)
      })))
      setStandingDistribution(sDistribution)
    }

    loadData()
  }, [])

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          {user && (
            <p className="text-muted-foreground mt-1">
              Welcome back, {user.firstName || user.username}!
            </p>
          )}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employeeCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Desks Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDesks}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Standing Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageStandingTime}h</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyGrowth}%</div>
          </CardContent>
        </Card>
      </div>
      <WeeklyActivityChart
        weeklyData={weeklyActivity}
        distributionData={standingDistribution}
      />
    </div>
  )
} 