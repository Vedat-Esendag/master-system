import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const ActivityLogs = () => {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("activity")
        .select(`
          *,
          desk:desk(
            *,
            employee:employee(*)
          )
        `)
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Activity Logs</h1>
        <p className="text-muted-foreground">Track standing desk usage over time</p>
      </div>

      <div className="grid gap-6">
        {activities?.map((activity) => (
          <Card key={activity.activity_id} className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{activity.desk.desk_name}</h3>
                <p className="text-sm text-muted-foreground">
                  Used by: {activity.desk.employee?.name || "Unassigned"}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">{activity.standing_time} minutes</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(activity.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogs;