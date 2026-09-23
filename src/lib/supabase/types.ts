// Hand-written to match supabase/migrations/0001_init.sql.
// Once the project is linked to a real Supabase instance, regenerate with:
//   npx supabase gen types typescript --linked > src/lib/supabase/types.ts

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1";
export type WordTag = "general" | "academic" | "it";
export type SrsResult = "forgot" | "hard" | "normal" | "easy";

export interface Database {
  public: {
    Tables: {
      words: {
        Row: {
          id: string;
          headword: string;
          translation: string;
          ipa: string | null;
          tag: WordTag;
          cefr_level: CefrLevel;
          example_sentence: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["words"]["Row"]> & {
          headword: string;
          translation: string;
          tag: WordTag;
          cefr_level: CefrLevel;
        };
        Update: Partial<Database["public"]["Tables"]["words"]["Row"]>;
      };
      texts: {
        Row: {
          id: string;
          title: string;
          body: string;
          cefr_level: CefrLevel;
          source_url: string | null;
          word_ids: string[];
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["texts"]["Row"]> & {
          title: string;
          body: string;
          cefr_level: CefrLevel;
        };
        Update: Partial<Database["public"]["Tables"]["texts"]["Row"]>;
      };
      grammar_exercises: {
        Row: {
          id: string;
          topic: string;
          topic_order: number;
          exercise_type: "multiple_choice" | "fill_blank";
          prompt: string;
          options: string[] | null;
          correct_answer: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["grammar_exercises"]["Row"]> & {
          topic: string;
          topic_order: number;
          exercise_type: "multiple_choice" | "fill_blank";
          prompt: string;
          correct_answer: string;
        };
        Update: Partial<Database["public"]["Tables"]["grammar_exercises"]["Row"]>;
      };
      listening_items: {
        Row: {
          id: string;
          title: string;
          source_url: string;
          start_seconds: number;
          end_seconds: number;
          transcript: string | null;
          cefr_level: CefrLevel;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["listening_items"]["Row"]> & {
          title: string;
          source_url: string;
          end_seconds: number;
          cefr_level: CefrLevel;
        };
        Update: Partial<Database["public"]["Tables"]["listening_items"]["Row"]>;
      };
      cards: {
        Row: {
          id: string;
          user_id: string;
          word_id: string;
          ease_factor: number;
          interval_days: number;
          repetitions: number;
          due_at: string;
          last_result: SrsResult | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["cards"]["Row"]> & {
          user_id: string;
          word_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["cards"]["Row"]>;
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          session_date: string;
          vocab_minutes: number;
          reading_minutes: number;
          listening_minutes: number;
          fluency_minutes: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["sessions"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["sessions"]["Row"]>;
      };
      progress: {
        Row: {
          user_id: string;
          current_streak_days: number;
          longest_streak_days: number;
          total_words_learned: number;
          last_session_date: string | null;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["progress"]["Row"]> & {
          user_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["progress"]["Row"]>;
      };
    };
  };
}
