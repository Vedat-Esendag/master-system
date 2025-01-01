import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const DeskDetail = () => {
  const { id } = useParams();

  const { data: desk, isLoading } = useQuery({
    queryKey: ["desk", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("desk")
        .select(`
          *,
          employee:employee(*),
          activity:activity(*)
        `)
        .eq("desk_id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!desk) return <div>Desk not found</div>;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{desk.desk_name}</h1>
        <p className="text-muted-foreground">
          Assigned to: {desk.employee?.name || "Unassigned"}
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Activity History</h2>
        <div className="space-y-4">
          {desk.activity?.map((activity) => (
            <div key={activity.activity_id} className="flex justify-between items-center">
              <span>{new Date(activity.date).toLocaleDateString()}</span>
              <span>{activity.standing_time} minutes</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DeskDetail;