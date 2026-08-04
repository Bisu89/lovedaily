/**
 * Hand-written to match supabase/migrations/0001_init.sql. Once a real
 * Supabase project exists, regenerate with:
 *   supabase gen types typescript --project-id <id> > lib/supabase/database.types.ts
 * The shape below is deliberately close to that output so the swap is a
 * drop-in replacement — no call sites change.
 *
 * `Relationships: []` is required on every table/view (even ones without
 * foreign keys) because supabase-js's GenericTable/GenericView types require
 * it — omitting it makes `Database["public"]` fail to satisfy GenericSchema,
 * which silently collapses every `.from()`/`.rpc()` call's return type to
 * `never`.
 */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          country: string | null
          language: string | null
          created_at: string
          last_login_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          avatar_url?: string | null
          country?: string | null
          language?: string | null
          created_at?: string
          last_login_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          country?: string | null
          language?: string | null
          created_at?: string
          last_login_at?: string
        }
        Relationships: []
      }
      ai_requests: {
        Row: {
          id: string
          user_id: string
          template_id: string
          tone: string | null
          language: string | null
          success: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          template_id: string
          tone?: string | null
          language?: string | null
          success?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          template_id?: string
          tone?: string | null
          language?: string | null
          success?: boolean
          created_at?: string
        }
        Relationships: []
      }
      feature_events: {
        Row: {
          id: string
          user_id: string | null
          event_name: string
          properties: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_name: string
          properties?: Record<string, unknown> | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          event_name?: string
          properties?: Record<string, unknown> | null
          created_at?: string
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          id: string
          level: string
          message: string
          context: Record<string, unknown> | null
          created_at: string
        }
        Insert: {
          id?: string
          level?: string
          message: string
          context?: Record<string, unknown> | null
          created_at?: string
        }
        Update: {
          id?: string
          level?: string
          message?: string
          context?: Record<string, unknown> | null
          created_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan: string
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan: string
          status: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan?: string
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      email_subscribers: {
        Row: {
          id: string
          email: string
          source: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          source?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          source?: string
          created_at?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          id: string
          user_id: string
          amount: number
          currency: string
          status: string
          stripe_payment_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          currency?: string
          status: string
          stripe_payment_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          amount?: number
          currency?: string
          status?: string
          stripe_payment_id?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      user_usage_stats: {
        Row: {
          user_id: string
          email: string
          first_visit: string
          last_visit: string
          total_generations: number
          last_generation: string | null
          active_days: number
          favorite_feature: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_dashboard_stats: {
        Args: Record<string, never>
        Returns: {
          total_users: number
          dau: number
          wau: number
          mau: number
          returning_users: number
          avg_generations_per_user: number
          most_used_feature: string | null
          most_active_country: string | null
          most_active_language: string | null
        }[]
      }
    }
  }
}
