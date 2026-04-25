import { useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../lib/supabase";
import { recentDateKeys, toDateKey } from "../../lib/dates";
import type { Habit, HabitCompletion } from "../../types/domain";
import { useAuth } from "../auth/AuthProvider";
import { toast } from "sonner";

export function useHabits() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: habits = [],
    isLoading: habitsLoading,
    error: habitsError,
  } = useQuery({
    queryKey: ["habits", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_archived", false)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as Habit[];
    },
    enabled: !!user,
  });

  const fromDate = useMemo(() => recentDateKeys(42)[0], []);

  const {
    data: completions = [],
    isLoading: completionsLoading,
    error: completionsError,
  } = useQuery({
    queryKey: ["completions", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase
        .from("habit_completions")
        .select("*")
        .eq("user_id", user.id)
        .gte("completed_date", fromDate);
      if (error) throw error;
      return data as HabitCompletion[];
    },
    enabled: !!user,
  });

  const completedToday = useMemo(() => {
    const today = toDateKey();
    return new Set(
      completions
        .filter((completion) => completion.completed_date === today)
        .map((completion) => completion.habit_id),
    );
  }, [completions]);

  const createMutation = useMutation({
    mutationFn: async (values: { title: string; color: string; cadence: string }) => {
      if (!user) throw new Error("No user");
      const { error } = await supabase.from("habits").insert({
        user_id: user.id,
        title: values.title,
        color: values.color,
        cadence: values.cadence,
        icon: "circle",
        sort_order: habits.length,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ habitId, values }: { habitId: string; values: { title: string; color: string; cadence: string } }) => {
      const { error } = await supabase
        .from("habits")
        .update({ ...values, updated_at: new Date().toISOString() })
        .eq("id", habitId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
  });

  const unarchiveMutation = useMutation({
    mutationFn: async (habitId: string) => {
      const { error } = await supabase
        .from("habits")
        .update({ is_archived: false, updated_at: new Date().toISOString() })
        .eq("id", habitId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["habits"] }),
  });

  const archiveMutation = useMutation({
    mutationFn: async (habitId: string) => {
      const { error } = await supabase
        .from("habits")
        .update({ is_archived: true, updated_at: new Date().toISOString() })
        .eq("id", habitId);
      if (error) throw error;
    },
    onSuccess: (_, habitId) => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      toast("Habit archived", {
        action: {
          label: "Undo",
          onClick: () => unarchiveMutation.mutate(habitId),
        },
      });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ habit, completed, date = toDateKey() }: { habit: Habit; completed: boolean; date?: string }) => {
      const { error } = await supabase.functions.invoke("toggle-habit", {
        body: { habitId: habit.id, date, completed },
      });
      if (error) throw error;
    },
    onMutate: async ({ habit, completed, date = toDateKey() }) => {
      await queryClient.cancelQueries({ queryKey: ["completions", user?.id] });
      const previousCompletions = queryClient.getQueryData<HabitCompletion[]>(["completions", user?.id]) || [];

      const optimisticCompletion: HabitCompletion = {
        id: `optimistic-${habit.id}-${date}`,
        user_id: user?.id || "",
        habit_id: habit.id,
        completed_date: date,
        completed_at: new Date().toISOString(),
        xp_awarded: 10,
      };

      queryClient.setQueryData<HabitCompletion[]>(["completions", user?.id], (old = []) => {
        if (completed) {
          return [...old.filter((item) => !(item.habit_id === habit.id && item.completed_date === date)), optimisticCompletion];
        } else {
          return old.filter((item) => !(item.habit_id === habit.id && item.completed_date === date));
        }
      });

      return { previousCompletions };
    },
    onError: (_err, _newVal, context) => {
      if (context?.previousCompletions) {
        queryClient.setQueryData(["completions", user?.id], context.previousCompletions);
      }
      toast.error("Failed to update habit.");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["completions"] });
      // Invalidate dashboard score when habit is toggled
      queryClient.invalidateQueries({ queryKey: ["dashboard"] }); 
    },
  });

  return {
    habits,
    completions,
    completedToday,
    loading: habitsLoading || completionsLoading,
    error: (habitsError || completionsError)?.message || "",
    busyHabitId: toggleMutation.isPending ? toggleMutation.variables?.habit.id : null,
    createHabit: (values: { title: string; color: string; cadence: string }) => createMutation.mutateAsync(values),
    updateHabit: (habitId: string, values: { title: string; color: string; cadence: string }) => updateMutation.mutateAsync({ habitId, values }),
    archiveHabit: (habitId: string) => archiveMutation.mutateAsync(habitId),
    toggleHabit: (habit: Habit, completed: boolean, date?: string) => toggleMutation.mutateAsync({ habit, completed, date }),
    reload: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["completions"] });
    },
  };
}

