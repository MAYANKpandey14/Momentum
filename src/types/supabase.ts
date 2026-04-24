export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      achievements: {
        Row: {
          description: string
          icon: string
          id: string
          key: string
          title: string
          unlocked_at: string
          user_id: string
        }
        Insert: {
          description: string
          icon?: string
          id?: string
          key: string
          title: string
          unlocked_at?: string
          user_id: string
        }
        Update: {
          description?: string
          icon?: string
          id?: string
          key?: string
          title?: string
          unlocked_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_scores: {
        Row: {
          completed_habits: number
          completion_percent: number
          has_journal: boolean
          has_workout: boolean
          id: string
          score_date: string
          streak_count: number
          total_habits: number
          updated_at: string
          user_id: string
          xp: number
        }
        Insert: {
          completed_habits?: number
          completion_percent?: number
          has_journal?: boolean
          has_workout?: boolean
          id?: string
          score_date: string
          streak_count?: number
          total_habits?: number
          updated_at?: string
          user_id: string
          xp?: number
        }
        Update: {
          completed_habits?: number
          completion_percent?: number
          has_journal?: boolean
          has_workout?: boolean
          id?: string
          score_date?: string
          streak_count?: number
          total_habits?: number
          updated_at?: string
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      exercise_entries: {
        Row: {
          id: string
          name: string
          reps: number
          sets: number
          sort_order: number
          unit: string | null
          user_id: string
          weight: number | null
          workout_id: string
        }
        Insert: {
          id?: string
          name: string
          reps: number
          sets: number
          sort_order?: number
          unit?: string | null
          user_id: string
          weight?: number | null
          workout_id: string
        }
        Update: {
          id?: string
          name?: string
          reps?: number
          sets?: number
          sort_order?: number
          unit?: string | null
          user_id?: string
          weight?: number | null
          workout_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "exercise_entries_workout_id_fkey"
            columns: ["workout_id"]
            isOneToOne: false
            referencedRelation: "workouts"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_completions: {
        Row: {
          completed_at: string
          completed_date: string
          habit_id: string
          id: string
          user_id: string
          xp_awarded: number
        }
        Insert: {
          completed_at?: string
          completed_date: string
          habit_id: string
          id?: string
          user_id: string
          xp_awarded?: number
        }
        Update: {
          completed_at?: string
          completed_date?: string
          habit_id?: string
          id?: string
          user_id?: string
          xp_awarded?: number
        }
        Relationships: [
          {
            foreignKeyName: "habit_completions_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          cadence: string
          color: string
          created_at: string
          icon: string
          id: string
          is_archived: boolean
          sort_order: number
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          cadence?: string
          color?: string
          created_at?: string
          icon?: string
          id?: string
          is_archived?: boolean
          sort_order?: number
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          cadence?: string
          color?: string
          created_at?: string
          icon?: string
          id?: string
          is_archived?: boolean
          sort_order?: number
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          content: string
          created_at: string
          entry_date: string
          id: string
          mood: string | null
          tags: string[]
          updated_at: string
          user_id: string
          xp_awarded: number
        }
        Insert: {
          content: string
          created_at?: string
          entry_date: string
          id?: string
          mood?: string | null
          tags?: string[]
          updated_at?: string
          user_id: string
          xp_awarded?: number
        }
        Update: {
          content?: string
          created_at?: string
          entry_date?: string
          id?: string
          mood?: string | null
          tags?: string[]
          updated_at?: string
          user_id?: string
          xp_awarded?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          id: string
          timezone: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          id: string
          timezone?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          id?: string
          timezone?: string
        }
        Relationships: []
      }
      workouts: {
        Row: {
          created_at: string
          duration_minutes: number | null
          id: string
          notes: string | null
          type: string
          user_id: string
          workout_date: string
          xp_awarded: number
        }
        Insert: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          type: string
          user_id: string
          workout_date: string
          xp_awarded?: number
        }
        Update: {
          created_at?: string
          duration_minutes?: number | null
          id?: string
          notes?: string | null
          type?: string
          user_id?: string
          workout_date?: string
          xp_awarded?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_show_up_streak: {
        Args: { p_date: string; p_user_id: string }
        Returns: number
      }
      save_journal_entry: {
        Args: {
          p_content: string
          p_date: string
          p_mood: string
          p_tags: string[]
          p_user_id: string
        }
        Returns: Json
      }
      save_workout_log: {
        Args: {
          p_date: string
          p_duration_minutes: number
          p_exercises: Json
          p_notes: string
          p_type: string
          p_user_id: string
        }
        Returns: Json
      }
      sync_daily_score: {
        Args: { p_date: string; p_user_id: string }
        Returns: Json
      }
      toggle_habit_completion: {
        Args: {
          p_completed: boolean
          p_date: string
          p_habit_id: string
          p_user_id: string
        }
        Returns: Json
      }
      unlock_achievement: {
        Args: {
          p_description: string
          p_icon?: string
          p_key: string
          p_title: string
          p_user_id: string
        }
        Returns: undefined
      }
      unlock_achievements_for_day: {
        Args: { p_date: string; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
