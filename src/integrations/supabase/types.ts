export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      Booking: {
        Row: {
          check_in: string | null
          check_out: string | null
          created_at: string
          id: string
          room_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          id?: string
          room_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          check_in?: string | null
          check_out?: string | null
          created_at?: string
          id?: string
          room_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      booking_analytics: {
        Row: {
          average_stay_duration: number | null
          booking_date: string | null
          id: string
          revenue: number | null
          room_id: string | null
          total_bookings: number | null
          updated_at: string | null
        }
        Insert: {
          average_stay_duration?: number | null
          booking_date?: string | null
          id?: string
          revenue?: number | null
          room_id?: string | null
          total_bookings?: number | null
          updated_at?: string | null
        }
        Update: {
          average_stay_duration?: number | null
          booking_date?: string | null
          id?: string
          revenue?: number | null
          room_id?: string | null
          total_bookings?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "booking_analytics_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "Room"
            referencedColumns: ["id"]
          },
        ]
      }
      Room: {
        Row: {
          amenities: string[] | null
          created_at: string
          id: string
          price: number | null
          room_category: string | null
          room_features: Json | null
          room_images: string[] | null
          room_no: string | null
          room_type: string | null
          Status: string | null
        }
        Insert: {
          amenities?: string[] | null
          created_at?: string
          id?: string
          price?: number | null
          room_category?: string | null
          room_features?: Json | null
          room_images?: string[] | null
          room_no?: string | null
          room_type?: string | null
          Status?: string | null
        }
        Update: {
          amenities?: string[] | null
          created_at?: string
          id?: string
          price?: number | null
          room_category?: string | null
          room_features?: Json | null
          room_images?: string[] | null
          room_no?: string | null
          room_type?: string | null
          Status?: string | null
        }
        Relationships: []
      }
      room_reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          id: string
          rating: number | null
          room_id: string | null
          user_id: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          room_id?: string | null
          user_id?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          id?: string
          rating?: number | null
          room_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "room_reviews_room_id_fkey"
            columns: ["room_id"]
            isOneToOne: false
            referencedRelation: "Room"
            referencedColumns: ["id"]
          },
        ]
      }
      User: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string | null
          password: string | null
          role: string | null
        }
        Insert: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          password?: string | null
          role?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string | null
          password?: string | null
          role?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
