export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          timezone: string;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          timezone?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string | null;
          timezone?: string;
          created_at?: string;
        };
      };
      habits: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          icon: string;
          color: string;
          cadence: string;
          sort_order: number;
          is_archived: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          icon?: string;
          color?: string;
          cadence?: string;
          sort_order?: number;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          icon?: string;
          color?: string;
          cadence?: string;
          sort_order?: number;
          is_archived?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      habit_completions: {
        Row: {
          id: string;
          user_id: string;
          habit_id: string;
          completed_date: string;
          completed_at: string;
          xp_awarded: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          habit_id: string;
          completed_date: string;
          completed_at?: string;
          xp_awarded?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          habit_id?: string;
          completed_date?: string;
          completed_at?: string;
          xp_awarded?: number;
        };
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          workout_date: string;
          type: string;
          duration_minutes: number | null;
          notes: string | null;
          xp_awarded: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          workout_date: string;
          type: string;
          duration_minutes?: number | null;
          notes?: string | null;
          xp_awarded?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          workout_date?: string;
          type?: string;
          duration_minutes?: number | null;
          notes?: string | null;
          xp_awarded?: number;
          created_at?: string;
        };
      };
      exercise_entries: {
        Row: {
          id: string;
          user_id: string;
          workout_id: string;
          name: string;
          sets: number;
          reps: number;
          weight: number | null;
          unit: string | null;
          sort_order: number;
        };
        Insert: {
          id?: string;
          user_id: string;
          workout_id: string;
          name: string;
          sets: number;
          reps: number;
          weight?: number | null;
          unit?: string | null;
          sort_order?: number;
        };
        Update: {
          id?: string;
          user_id?: string;
          workout_id?: string;
          name?: string;
          sets?: number;
          reps?: number;
          weight?: number | null;
          unit?: string | null;
          sort_order?: number;
        };
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          entry_date: string;
          content: string;
          mood: string | null;
          tags: string[];
          xp_awarded: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          entry_date: string;
          content: string;
          mood?: string | null;
          tags?: string[];
          xp_awarded?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          entry_date?: string;
          content?: string;
          mood?: string | null;
          tags?: string[];
          xp_awarded?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      daily_scores: {
        Row: {
          id: string;
          user_id: string;
          score_date: string;
          xp: number;
          completion_percent: number;
          completed_habits: number;
          total_habits: number;
          has_workout: boolean;
          has_journal: boolean;
          streak_count: number;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          score_date: string;
          xp?: number;
          completion_percent?: number;
          completed_habits?: number;
          total_habits?: number;
          has_workout?: boolean;
          has_journal?: boolean;
          streak_count?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          score_date?: string;
          xp?: number;
          completion_percent?: number;
          completed_habits?: number;
          total_habits?: number;
          has_workout?: boolean;
          has_journal?: boolean;
          streak_count?: number;
          updated_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          user_id: string;
          key: string;
          title: string;
          description: string;
          icon: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          key: string;
          title: string;
          description: string;
          icon?: string;
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          key?: string;
          title?: string;
          description?: string;
          icon?: string;
          unlocked_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: {
      toggle_habit_completion: {
        Args: {
          p_user_id: string;
          p_habit_id: string;
          p_date: string;
          p_completed: boolean;
        };
        Returns: Json;
      };
      save_workout_log: {
        Args: {
          p_user_id: string;
          p_date: string;
          p_type: string;
          p_duration_minutes: number | null;
          p_notes: string | null;
          p_exercises: Json;
        };
        Returns: Json;
      };
      save_journal_entry: {
        Args: {
          p_user_id: string;
          p_date: string;
          p_content: string;
          p_mood: string | null;
          p_tags: string[];
        };
        Returns: Json;
      };
      sync_daily_score: {
        Args: {
          p_user_id: string;
          p_date: string;
        };
        Returns: Json;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

