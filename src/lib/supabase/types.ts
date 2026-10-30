// Generated via the Supabase MCP `generate_typescript_types` tool against the
// live project (ref betitjcrobqmuumlsjrv). Regenerate after schema changes:
//   npx supabase gen types typescript --linked > src/lib/supabase/types.ts
// (then re-add the convenience aliases at the bottom of this file).

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
  public: {
    Tables: {
      cards: {
        Row: {
          created_at: string
          due_at: string
          ease_factor: number
          id: string
          interval_days: number
          last_result: Database["public"]["Enums"]["srs_result"] | null
          repetitions: number
          updated_at: string
          user_id: string
          word_id: string
        }
        Insert: {
          created_at?: string
          due_at?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          last_result?: Database["public"]["Enums"]["srs_result"] | null
          repetitions?: number
          updated_at?: string
          user_id: string
          word_id: string
        }
        Update: {
          created_at?: string
          due_at?: string
          ease_factor?: number
          id?: string
          interval_days?: number
          last_result?: Database["public"]["Enums"]["srs_result"] | null
          repetitions?: number
          updated_at?: string
          user_id?: string
          word_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_word_id_fkey"
            columns: ["word_id"]
            isOneToOne: false
            referencedRelation: "words"
            referencedColumns: ["id"]
          },
        ]
      }
      grammar_attempts: {
        Row: {
          answer: string
          created_at: string
          exercise_id: string
          id: string
          is_correct: boolean
          user_id: string
        }
        Insert: {
          answer: string
          created_at?: string
          exercise_id: string
          id?: string
          is_correct: boolean
          user_id: string
        }
        Update: {
          answer?: string
          created_at?: string
          exercise_id?: string
          id?: string
          is_correct?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grammar_attempts_exercise_id_fkey"
            columns: ["exercise_id"]
            isOneToOne: false
            referencedRelation: "grammar_exercises"
            referencedColumns: ["id"]
          },
        ]
      }
      grammar_exercises: {
        Row: {
          accepted_answers: string[]
          correct_answer: string
          created_at: string
          exercise_type: Database["public"]["Enums"]["exercise_type"]
          explanation: string | null
          id: string
          options: string[] | null
          position: number
          prompt: string
          topic_id: string
        }
        Insert: {
          accepted_answers?: string[]
          correct_answer: string
          created_at?: string
          exercise_type: Database["public"]["Enums"]["exercise_type"]
          explanation?: string | null
          id?: string
          options?: string[] | null
          position?: number
          prompt: string
          topic_id: string
        }
        Update: {
          accepted_answers?: string[]
          correct_answer?: string
          created_at?: string
          exercise_type?: Database["public"]["Enums"]["exercise_type"]
          explanation?: string | null
          id?: string
          options?: string[] | null
          position?: number
          prompt?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "grammar_exercises_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "grammar_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      grammar_topics: {
        Row: {
          created_at: string
          id: string
          section: string
          summary: string | null
          title: string
          unit: number
        }
        Insert: {
          created_at?: string
          id?: string
          section: string
          summary?: string | null
          title: string
          unit: number
        }
        Update: {
          created_at?: string
          id?: string
          section?: string
          summary?: string | null
          title?: string
          unit?: number
        }
        Relationships: []
      }
      listening_items: {
        Row: {
          cefr_level: Database["public"]["Enums"]["cefr_level"]
          created_at: string
          end_seconds: number | null
          id: string
          kind: Database["public"]["Enums"]["listening_kind"]
          lines: Json
          position: number
          source_url: string | null
          start_seconds: number
          title: string
          transcript: string | null
        }
        Insert: {
          cefr_level: Database["public"]["Enums"]["cefr_level"]
          created_at?: string
          end_seconds?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["listening_kind"]
          lines?: Json
          position?: number
          source_url?: string | null
          start_seconds?: number
          title: string
          transcript?: string | null
        }
        Update: {
          cefr_level?: Database["public"]["Enums"]["cefr_level"]
          created_at?: string
          end_seconds?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["listening_kind"]
          lines?: Json
          position?: number
          source_url?: string | null
          start_seconds?: number
          title?: string
          transcript?: string | null
        }
        Relationships: []
      }
      listening_logs: {
        Row: {
          accuracy: number | null
          created_at: string
          id: string
          item_id: string
          seconds_spent: number
          user_id: string
        }
        Insert: {
          accuracy?: number | null
          created_at?: string
          id?: string
          item_id: string
          seconds_spent?: number
          user_id: string
        }
        Update: {
          accuracy?: number | null
          created_at?: string
          id?: string
          item_id?: string
          seconds_spent?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listening_logs_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "listening_items"
            referencedColumns: ["id"]
          },
        ]
      }
      progress: {
        Row: {
          current_streak_days: number
          last_session_date: string | null
          longest_streak_days: number
          total_words_learned: number
          updated_at: string
          user_id: string
        }
        Insert: {
          current_streak_days?: number
          last_session_date?: string | null
          longest_streak_days?: number
          total_words_learned?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          current_streak_days?: number
          last_session_date?: string | null
          longest_streak_days?: number
          total_words_learned?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          completed_steps: string[]
          created_at: string
          fluency_minutes: number
          grammar_minutes: number
          id: string
          listening_minutes: number
          reading_minutes: number
          session_date: string
          user_id: string
          vocab_minutes: number
        }
        Insert: {
          completed_steps?: string[]
          created_at?: string
          fluency_minutes?: number
          grammar_minutes?: number
          id?: string
          listening_minutes?: number
          reading_minutes?: number
          session_date?: string
          user_id: string
          vocab_minutes?: number
        }
        Update: {
          completed_steps?: string[]
          created_at?: string
          fluency_minutes?: number
          grammar_minutes?: number
          id?: string
          listening_minutes?: number
          reading_minutes?: number
          session_date?: string
          user_id?: string
          vocab_minutes?: number
        }
        Relationships: []
      }
      text_reads: {
        Row: {
          correct_answers: number
          created_at: string
          id: string
          mode: Database["public"]["Enums"]["read_mode"]
          seconds_spent: number
          text_id: string
          user_id: string
          words_per_minute: number | null
        }
        Insert: {
          correct_answers?: number
          created_at?: string
          id?: string
          mode?: Database["public"]["Enums"]["read_mode"]
          seconds_spent?: number
          text_id: string
          user_id: string
          words_per_minute?: number | null
        }
        Update: {
          correct_answers?: number
          created_at?: string
          id?: string
          mode?: Database["public"]["Enums"]["read_mode"]
          seconds_spent?: number
          text_id?: string
          user_id?: string
          words_per_minute?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "text_reads_text_id_fkey"
            columns: ["text_id"]
            isOneToOne: false
            referencedRelation: "texts"
            referencedColumns: ["id"]
          },
        ]
      }
      texts: {
        Row: {
          body: string
          cefr_level: Database["public"]["Enums"]["cefr_level"]
          created_at: string
          id: string
          position: number
          questions: Json
          source_url: string | null
          title: string
          word_ids: string[]
        }
        Insert: {
          body: string
          cefr_level: Database["public"]["Enums"]["cefr_level"]
          created_at?: string
          id?: string
          position?: number
          questions?: Json
          source_url?: string | null
          title: string
          word_ids?: string[]
        }
        Update: {
          body?: string
          cefr_level?: Database["public"]["Enums"]["cefr_level"]
          created_at?: string
          id?: string
          position?: number
          questions?: Json
          source_url?: string | null
          title?: string
          word_ids?: string[]
        }
        Relationships: []
      }
      words: {
        Row: {
          cefr_level: Database["public"]["Enums"]["cefr_level"]
          created_at: string
          example_sentence: string | null
          headword: string
          id: string
          ipa: string | null
          sort_order: number
          source: string | null
          tag: Database["public"]["Enums"]["word_tag"]
          translation: string
        }
        Insert: {
          cefr_level: Database["public"]["Enums"]["cefr_level"]
          created_at?: string
          example_sentence?: string | null
          headword: string
          id?: string
          ipa?: string | null
          sort_order?: number
          source?: string | null
          tag: Database["public"]["Enums"]["word_tag"]
          translation: string
        }
        Update: {
          cefr_level?: Database["public"]["Enums"]["cefr_level"]
          created_at?: string
          example_sentence?: string | null
          headword?: string
          id?: string
          ipa?: string | null
          sort_order?: number
          source?: string | null
          tag?: Database["public"]["Enums"]["word_tag"]
          translation?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      record_step: {
        Args: { p_date: string; p_minutes: number; p_step: string }
        Returns: undefined
      }
    }
    Enums: {
      cefr_level: "A1" | "A2" | "B1" | "B2" | "C1"
      exercise_type: "multiple_choice" | "fill_blank"
      listening_kind: "tts" | "youtube"
      read_mode: "reading" | "fluency"
      srs_result: "forgot" | "hard" | "normal" | "easy"
      word_tag: "general" | "academic" | "it"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      cefr_level: ["A1", "A2", "B1", "B2", "C1"],
      exercise_type: ["multiple_choice", "fill_blank"],
      listening_kind: ["tts", "youtube"],
      read_mode: ["reading", "fluency"],
      srs_result: ["forgot", "hard", "normal", "easy"],
      word_tag: ["general", "academic", "it"],
    },
  },
} as const

// --- Convenience aliases used across the app (kept across regenerations) ---
export type CefrLevel = Database["public"]["Enums"]["cefr_level"]
export type WordTag = Database["public"]["Enums"]["word_tag"]
export type SrsResult = Database["public"]["Enums"]["srs_result"]
export type ExerciseType = Database["public"]["Enums"]["exercise_type"]
export type ListeningKind = Database["public"]["Enums"]["listening_kind"]
