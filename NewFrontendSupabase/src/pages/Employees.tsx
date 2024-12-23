import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const Employees = () => {
  const { data: employees, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("employee")
        .select("*");
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Employees</h1>
        <p className="text-muted-foreground">Manage your team members</p>
      </div>

      <div className="grid gap-6">
        {employees?.map((employee) => (
          <Card key={employee.employee_id} className="p-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{employee.name}</h3>
                <p className="text-sm text-muted-foreground">{employee.position}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Employees;