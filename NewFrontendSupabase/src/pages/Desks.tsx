import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Desks = () => {
  const { data: desks, isLoading } = useQuery({
    queryKey: ["desks"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("desk")
        .select(`
          *,
          employee:employee(*)
        `);
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Desks</h1>
        <p className="text-muted-foreground">Manage your standing desks</p>
      </div>

      <div className="grid gap-6">
        {desks?.map((desk) => (
          <Card key={desk.desk_id} className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{desk.desk_name}</h3>
                <p className="text-sm text-muted-foreground">
                  Assigned to: {desk.employee?.name || "Unassigned"}
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Desks;