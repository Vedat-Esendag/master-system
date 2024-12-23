import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Trophy } from "lucide-react";
import { fetchEmployeeLeaderboard } from "@/lib/queries";

export function EmployeeLeaderboard() {
  const { data: leaderboard = [] } = useQuery({
    queryKey: ["employeeLeaderboard"],
    queryFn: fetchEmployeeLeaderboard,
  });

  return (
    <Card className="p-6 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Top Performers</h3>
        <Trophy className="h-5 w-5 text-yellow-500" />
      </div>
      <div className="space-y-4">
        {leaderboard.map((employee, index) => (
          <div
            key={employee.name}
            className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 transition-all duration-300 hover:bg-secondary"
          >
            <div className="flex items-center gap-3">
              <span className="font-semibold text-lg">{index + 1}</span>
              <div>
                <p className="font-medium">{employee.name}</p>
                <p className="text-sm text-muted-foreground">
                  {employee.position}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="bg-accent text-accent-foreground">
              {employee.totalStandingTime}h
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  );
}