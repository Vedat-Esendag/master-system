import { Users, Monitor, Clock, TrendingUp } from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { ActivityChart } from "@/components/ActivityChart";
import { EmployeeList } from "@/components/EmployeeList";
import { useQuery } from "@tanstack/react-query";
import { 
  fetchEmployeeCount, 
  fetchActiveDesks, 
  fetchAverageStandingTime, 
  fetchWeeklyGrowth,
  fetchWeeklyActivity,
  fetchActiveEmployees
} from "@/lib/queries";

const Index = () => {
  const { data: employeeCount = 0 } = useQuery({
    queryKey: ['employeeCount'],
    queryFn: fetchEmployeeCount
  });

  const { data: activeDesks = 0 } = useQuery({
    queryKey: ['activeDesks'],
    queryFn: fetchActiveDesks
  });

  const { data: averageStandingTime = 0 } = useQuery({
    queryKey: ['averageStandingTime'],
    queryFn: fetchAverageStandingTime
  });

  const { data: weeklyGrowth = 0 } = useQuery({
    queryKey: ['weeklyGrowth'],
    queryFn: fetchWeeklyGrowth
  });

  const { data: weeklyActivity = [] } = useQuery({
    queryKey: ['weeklyActivity'],
    queryFn: fetchWeeklyActivity
  });

  const { data: activeEmployees = [] } = useQuery({
    queryKey: ['activeEmployees'],
    queryFn: fetchActiveEmployees
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your team's standing desk activity
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Employees"
            value={employeeCount}
            icon={<Users className="h-6 w-6" />}
          />
          <MetricCard
            title="Active Desks"
            value={activeDesks}
            icon={<Monitor className="h-6 w-6" />}
          />
          <MetricCard
            title="Average Standing Time"
            value={`${averageStandingTime}h`}
            icon={<Clock className="h-6 w-6" />}
          />
          <MetricCard
            title="Weekly Growth"
            value={`${weeklyGrowth}%`}
            icon={<TrendingUp className="h-6 w-6" />}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ActivityChart data={weeklyActivity} />
          <EmployeeList employees={activeEmployees} />
        </div>
      </div>
    </div>
  );
};

export default Index;