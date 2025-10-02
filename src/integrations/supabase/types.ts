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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      bookings: {
        Row: {
          booking_reference: string
          created_at: string
          currency: string | null
          id: string
          qr_code: string | null
          schedule_id: string
          status: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at: string
          user_id: string
        }
        Insert: {
          booking_reference: string
          created_at?: string
          currency?: string | null
          id?: string
          qr_code?: string | null
          schedule_id: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount: number
          updated_at?: string
          user_id: string
        }
        Update: {
          booking_reference?: string
          created_at?: string
          currency?: string | null
          id?: string
          qr_code?: string | null
          schedule_id?: string
          status?: Database["public"]["Enums"]["booking_status"] | null
          total_amount?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "detailed_schedules_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          booking_id: string | null
          created_at: string
          id: string
          is_read: boolean | null
          message: string
          sent_via: string | null
          type: string
          user_id: string
        }
        Insert: {
          booking_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message: string
          sent_via?: string | null
          type: string
          user_id: string
        }
        Update: {
          booking_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean | null
          message?: string
          sent_via?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      otp_verifications: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          otp_code: string
          phone: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          otp_code: string
          phone: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          otp_code?: string
          phone?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      passengers: {
        Row: {
          booking_id: string
          created_at: string
          email: string | null
          full_name: string
          id: string
          id_number: string | null
          phone: string | null
          seat_id: string
        }
        Insert: {
          booking_id: string
          created_at?: string
          email?: string | null
          full_name: string
          id?: string
          id_number?: string | null
          phone?: string | null
          seat_id: string
        }
        Update: {
          booking_id?: string
          created_at?: string
          email?: string | null
          full_name?: string
          id?: string
          id_number?: string | null
          phone?: string | null
          seat_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "passengers_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "passengers_seat_id_fkey"
            columns: ["seat_id"]
            isOneToOne: false
            referencedRelation: "seat_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          booking_id: string
          created_at: string
          currency: string | null
          id: string
          payment_date: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          transaction_reference: string | null
          updated_at: string
        }
        Insert: {
          amount: number
          booking_id: string
          created_at?: string
          currency?: string | null
          id?: string
          payment_date?: string | null
          payment_method: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_reference?: string | null
          updated_at?: string
        }
        Update: {
          amount?: number
          booking_id?: string
          created_at?: string
          currency?: string | null
          id?: string
          payment_date?: string | null
          payment_method?: Database["public"]["Enums"]["payment_method"]
          payment_status?: Database["public"]["Enums"]["payment_status"] | null
          transaction_reference?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          full_name: string | null
          id: string
          nationality: string | null
          notification_preferences: Json | null
          phone: string | null
          phone_verified: boolean | null
          preferred_language: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          full_name?: string | null
          id?: string
          nationality?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          phone_verified?: boolean | null
          preferred_language?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          full_name?: string | null
          id?: string
          nationality?: string | null
          notification_preferences?: Json | null
          phone?: string | null
          phone_verified?: boolean | null
          preferred_language?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      revenue_records: {
        Row: {
          booking_id: string
          commission_amount: number
          company_id: string
          created_at: string
          currency: string | null
          gross_amount: number
          id: string
          net_amount: number
          settlement_date: string | null
          settlement_status: string | null
        }
        Insert: {
          booking_id: string
          commission_amount: number
          company_id: string
          created_at?: string
          currency?: string | null
          gross_amount: number
          id?: string
          net_amount: number
          settlement_date?: string | null
          settlement_status?: string | null
        }
        Update: {
          booking_id?: string
          commission_amount?: number
          company_id?: string
          created_at?: string
          currency?: string | null
          gross_amount?: number
          id?: string
          net_amount?: number
          settlement_date?: string | null
          settlement_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "revenue_records_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenue_records_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "transport_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      routes: {
        Row: {
          company_id: string
          created_at: string
          distance_km: number | null
          end_location: string
          estimated_duration_minutes: number | null
          id: string
          is_active: boolean | null
          start_location: string
          updated_at: string
        }
        Insert: {
          company_id: string
          created_at?: string
          distance_km?: number | null
          end_location: string
          estimated_duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          start_location: string
          updated_at?: string
        }
        Update: {
          company_id?: string
          created_at?: string
          distance_km?: number | null
          end_location?: string
          estimated_duration_minutes?: number | null
          id?: string
          is_active?: boolean | null
          start_location?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "routes_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "transport_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      schedules: {
        Row: {
          arrival_time: string
          base_price: number
          created_at: string
          currency: string | null
          departure_time: string
          id: string
          is_active: boolean | null
          route_id: string
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          arrival_time: string
          base_price: number
          created_at?: string
          currency?: string | null
          departure_time: string
          id?: string
          is_active?: boolean | null
          route_id: string
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          arrival_time?: string
          base_price?: number
          created_at?: string
          currency?: string | null
          departure_time?: string
          id?: string
          is_active?: boolean | null
          route_id?: string
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "schedules_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "schedules_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      seat_availability: {
        Row: {
          created_at: string
          id: string
          reserved_until: string | null
          schedule_id: string
          seat_id: string
          status: Database["public"]["Enums"]["seat_status"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          reserved_until?: string | null
          schedule_id: string
          seat_id: string
          status?: Database["public"]["Enums"]["seat_status"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          reserved_until?: string | null
          schedule_id?: string
          seat_id?: string
          status?: Database["public"]["Enums"]["seat_status"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seat_availability_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "detailed_schedules_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_availability_schedule_id_fkey"
            columns: ["schedule_id"]
            isOneToOne: false
            referencedRelation: "schedules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "seat_availability_seat_id_fkey"
            columns: ["seat_id"]
            isOneToOne: false
            referencedRelation: "seat_configurations"
            referencedColumns: ["id"]
          },
        ]
      }
      seat_configurations: {
        Row: {
          column_number: number
          created_at: string
          id: string
          is_active: boolean | null
          row_number: number
          seat_number: string
          vehicle_id: string
        }
        Insert: {
          column_number: number
          created_at?: string
          id?: string
          is_active?: boolean | null
          row_number: number
          seat_number: string
          vehicle_id: string
        }
        Update: {
          column_number?: number
          created_at?: string
          id?: string
          is_active?: boolean | null
          row_number?: number
          seat_number?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "seat_configurations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      transport_companies: {
        Row: {
          commission_rate: number | null
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          logo_url: string | null
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          commission_rate?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          commission_rate?: number | null
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          logo_url?: string | null
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
          ip_address: unknown | null
          is_active: boolean | null
          last_activity: string
          session_id: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string
          session_id: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
          ip_address?: unknown | null
          is_active?: boolean | null
          last_activity?: string
          session_id?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          company_id: string
          created_at: string
          id: string
          is_active: boolean | null
          model: string | null
          plate_number: string
          total_seats: number
          updated_at: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Insert: {
          company_id: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          model?: string | null
          plate_number: string
          total_seats: number
          updated_at?: string
          vehicle_type: Database["public"]["Enums"]["vehicle_type"]
        }
        Update: {
          company_id?: string
          created_at?: string
          id?: string
          is_active?: boolean | null
          model?: string | null
          plate_number?: string
          total_seats?: number
          updated_at?: string
          vehicle_type?: Database["public"]["Enums"]["vehicle_type"]
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "transport_companies"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      detailed_schedules_view: {
        Row: {
          arrival_time: string | null
          available_seats: number | null
          company_name: string | null
          departure_time: string | null
          distance_km: number | null
          end_location: string | null
          estimated_duration_minutes: number | null
          id: string | null
          price: number | null
          start_location: string | null
          total_seats: number | null
          vehicle_type: Database["public"]["Enums"]["vehicle_type"] | null
        }
        Relationships: []
      }
    }
    Functions: {
      cleanup_expired_reservations: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      generate_booking_reference: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      reserve_seats_temporarily: {
        Args: {
          p_minutes?: number
          p_schedule_id: string
          p_seat_ids: string[]
        }
        Returns: boolean
      }
    }
    Enums: {
      booking_status: "pending" | "confirmed" | "cancelled" | "completed"
      payment_method: "orange_money" | "credit_card" | "debit_card" | "cash"
      payment_status: "pending" | "completed" | "failed" | "refunded"
      seat_status: "available" | "reserved" | "booked"
      vehicle_type: "bus" | "minibus" | "van"
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
  public: {
    Enums: {
      booking_status: ["pending", "confirmed", "cancelled", "completed"],
      payment_method: ["orange_money", "credit_card", "debit_card", "cash"],
      payment_status: ["pending", "completed", "failed", "refunded"],
      seat_status: ["available", "reserved", "booked"],
      vehicle_type: ["bus", "minibus", "van"],
    },
  },
} as const
