
export interface SpiritualRoutine {
  id: string;
  user_id: string;
  title: string;
  description: string;
  frequency: "daily" | "weekly" | "monthly" | "custom";
  day_of_week?: number | null; // 0-6, where 0 is Sunday
  time_of_day: string; // Time string in "HH:MM" format
  created_at: string;
  updated_at: string;
}
