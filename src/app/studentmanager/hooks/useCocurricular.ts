// src/app/studentmanager/hooks/useCocurricular.ts
"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import { CocurricularActivity } from "../types/cocurricular";

export function useCocurricular(studentId: number) {
  const [activities, setActivities] = useState<CocurricularActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("cocurricular_activities")
      .select("*")
      .eq("student_id", studentId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching co-curricular activities:", error);
      setActivities([]);
    } else {
      setActivities(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const addActivity = async (
    activity: Omit<CocurricularActivity, "id" | "created_at">
  ) => {
    const { error } = await supabase
      .from("cocurricular_activities")
      .insert(activity);

    if (error) {
      console.error("Error adding activity:", error);
      throw error;
    }

    await fetchActivities();
  };

  const deleteActivity = async (id: number) => {
    const { error } = await supabase
      .from("cocurricular_activities")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting activity:", error);
      throw error;
    }

    await fetchActivities();
  };

  return {
    activities,
    loading,
    addActivity,
    deleteActivity,
    refetch: fetchActivities,
  };
}
