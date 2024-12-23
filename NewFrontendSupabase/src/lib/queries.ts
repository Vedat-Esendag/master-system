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
    .select(`
      standing_time,
      date,
      desk:desk(
        desk_name,
        employee:employee(
          name
        )
      )
    `)
    .order('date', { ascending: true })
    .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
    .lte('date', new Date().toISOString().split('T')[0]);

  // Group by date and calculate total standing time and unique users
  const dailyStats = (data || []).reduce((acc, activity) => {
    const day = new Date(activity.date).toLocaleDateString('en-US', { weekday: 'short' });
    if (!acc[day]) {
      acc[day] = {
        totalMinutes: 0,
        uniqueUsers: new Set(),
        standingHours: {} // Track activity by hour
      };
    }
    acc[day].totalMinutes += activity.standing_time;
    if (activity.desk?.employee?.name) {
      acc[day].uniqueUsers.add(activity.desk.employee.name);
    }
    
    // Track standing time distribution throughout the day
    const hour = Math.floor(activity.standing_time / 60);
    acc[day].standingHours[hour] = (acc[day].standingHours[hour] || 0) + 1;
    
    return acc;
  }, {} as Record<string, { totalMinutes: number; uniqueUsers: Set<string>; standingHours: Record<number, number> }>);

  // Convert to array and calculate percentages
  return Object.entries(dailyStats).map(([day, stats]) => ({
    day,
    minutes: stats.totalMinutes,
    uniqueUsers: stats.uniqueUsers.size,
    averagePerUser: Math.round(stats.totalMinutes / stats.uniqueUsers.size),
    peakHour: Object.entries(stats.standingHours)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 0
  }));
}

export async function fetchStandingDistribution() {
  const { data } = await supabase
    .from("activity")
    .select(`
      standing_time,
      desk:desk(
        desk_name,
        employee:employee(
          name
        )
      )
    `)
    .gte('date', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

  // Calculate standing time distribution
  const userStats = (data || []).reduce((acc, activity) => {
    const userName = activity.desk?.employee?.name || 'Unknown';
    if (!acc[userName]) {
      acc[userName] = {
        totalTime: 0,
        sessions: 0
      };
    }
    acc[userName].totalTime += activity.standing_time;
    acc[userName].sessions += 1;
    return acc;
  }, {} as Record<string, { totalTime: number; sessions: number }>);

  // Convert to array and calculate percentages
  const total = Object.values(userStats).reduce((sum, { totalTime }) => sum + totalTime, 0);
  
  return Object.entries(userStats)
    .map(([name, stats]) => ({
      name,
      percentage: Math.round((stats.totalTime / total) * 100),
      averageSession: Math.round(stats.totalTime / stats.sessions),
      totalHours: Math.round(stats.totalTime / 60 * 10) / 10
    }))
    .sort((a, b) => b.percentage - a.percentage);
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

export async function createEmployee(data: { name: string; position: string }) {
  const { data: employee, error } = await supabase
    .from("employee")
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return employee;
}

export async function fetchAllDesks() {
  const { data } = await supabase
    .from("desk")
    .select(`
      desk_id,
      desk_name,
      employee_id,
      employee:employee(*)
    `);

  // Transform the data to match our interface
  return (data || []).map(desk => ({
    ...desk,
    employee: Array.isArray(desk.employee) && desk.employee.length > 0 ? desk.employee[0] : null
  }));
}

export async function assignDeskToEmployee(employeeId: string, deskId: string | null) {
  if (!deskId) {
    // Unassign the employee from their current desk
    const { error } = await supabase
      .from("desk")
      .update({ employee_id: null as unknown as undefined })
      .eq("employee_id", parseInt(employeeId));
    
    if (error) throw error;
    return;
  }

  // First, unassign any desk currently assigned to this employee
  await supabase
    .from("desk")
    .update({ employee_id: null as unknown as undefined })
    .eq("employee_id", parseInt(employeeId));

  // Then assign the new desk to the employee
  const { data, error } = await supabase
    .from("desk")
    .update({ employee_id: parseInt(employeeId) })
    .eq("desk_id", parseInt(deskId))
    .select(`
      desk_id,
      desk_name,
      employee_id
    `)
    .single();

  if (error) throw error;
  return data;
}

export async function fetchAllEmployees() {
  const { data } = await supabase
    .from("employee")
    .select(`
      employee_id,
      name,
      position,
      desk(*)
    `);
  
  // Transform the data to match our interface
  return (data || []).map(employee => ({
    ...employee,
    desk: Array.isArray(employee.desk) && employee.desk.length > 0 ? employee.desk[0] : null
  }));
}

export async function createDesk(data: { desk_name: string; employee_id: number | null }) {
  const { data: desk, error } = await supabase
    .from("desk")
    .insert([{ desk_name: data.desk_name }] as any)
    .select(`
      desk_id,
      desk_name,
      employee_id
    `)
    .single();

  if (error) throw error;
  return desk;
}

export async function deleteDesk(deskId: number) {
  const { error } = await supabase
    .from("desk")
    .delete()
    .eq("desk_id", deskId);

  if (error) throw error;
}