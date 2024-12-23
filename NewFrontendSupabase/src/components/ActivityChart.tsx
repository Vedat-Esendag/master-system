import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface ActivityChartProps {
  data: Array<{
    day: string;
    minutes: number;
  }>;
}

export function ActivityChart({ data }: ActivityChartProps) {
  return (
    <Card className="p-6 animate-fade-up">
      <h3 className="font-semibold mb-4">Weekly Standing Time</h3>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="minutes" fill="#4A6741" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}