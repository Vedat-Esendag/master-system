import { supabase } from "@/integrations/supabase/client";

export async function fetchEmployeeCount() {
  const { count } = await supabase
    .from("employee")
    .select("*", { count: "exact", head: true });
  return count || 0;
}

export async function fetchActiveDesks() {
  const today = new Date().toISOString().split("T")[0];
  const { count } = await supabase
    .from("activity")
    .select("*", { count: "exact", head: true })
    .eq("date", today);
  return count || 0;
}

export async function fetchAverageStandingTime() {
  const { data } = await supabase
    .from("activity")
    .select("standing_time")
    .order("date", { ascending: false })
    .limit(50);

  if (!data?.length) return 0;
  const average = data.reduce((acc, curr) => acc + curr.standing_time, 0) / data.length;
  return (average / 60).toFixed(1); // Convert minutes to hours
}

export async function fetchWeeklyGrowth() {
  const { data } = await supabase
    .from("activity")
    .select("standing_time, date")
    .order("date", { ascending: false })
    .limit(14); // Two weeks of data

  if (!data?.length) return 0;

  const thisWeek = data.slice(0, 7).reduce((acc, curr) => acc + curr.standing_time, 0);
  const lastWeek = data.slice(7, 14).reduce((acc, curr) => acc + curr.standing_time, 0);

  if (lastWeek === 0) return 100;
  const growth = ((thisWeek - lastWeek) / lastWeek) * 100;
  return growth.toFixed(0);
}

export async function fetchWeeklyActivity() {
  const { data } = await supabase
    .from("activity")
    .select("standing_time, date")
    .order("date", { ascending: true })
    .limit(7);

  return (
    data?.map((item) => ({
      day: new Date(item.date).toLocaleDateString("en-US", { weekday: "short" }),
      minutes: item.standing_time,
    })) || []
  );
}

export async function fetchActiveEmployees() {
  const { data } = await supabase
    .from("employee")
    .select(`
      *,
      desk:desk(*)
    `)
    .limit(3);

  return (
    data?.map((employee) => ({
      name: employee.name,
      position: employee.position,
      standingTime: "3h 20m", // This would need to be calculated from activity data
    })) || []
  );
}

export async function fetchEmployeeLeaderboard() {
  const { data } = await supabase
    .from("employee")
    .select(`
      *,
      desk:desk(desk_id),
      activity:desk(
        activity(standing_time)
      )
    `)
    .limit(5);

  return (
    data?.map((employee) => ({
      name: employee.name,
      position: employee.position,
      totalStandingTime: "4.5", // This needs to be calculated from the activity data
    })) || []
  );
}