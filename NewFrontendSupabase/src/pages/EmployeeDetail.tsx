import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const EmployeeDetail = () => {
  const { id } = useParams();

  const { data: employee, isLoading } = useQuery({
    queryKey: ["employee", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employee")
        .select(`
          *,
          desk:desk(*)
        `)
        .eq("employee_id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (!employee) return <div>Employee not found</div>;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">{employee.name}</h1>
        <p className="text-muted-foreground">{employee.position}</p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Employee Details</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Position</h3>
            <p className="text-muted-foreground">{employee.position || "Not assigned"}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default EmployeeDetail;