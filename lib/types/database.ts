export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          created_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          created_at?: string
        }
      }
      timesheet_entries: {
        Row: {
          id: string
          user_id: string
          activity: string
          start_time: string
          end_time: string | null
          duration_minutes: number | null
          entry_date: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity: string
          start_time: string
          end_time?: string | null
          duration_minutes?: number | null
          entry_date: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity?: string
          start_time?: string
          end_time?: string | null
          duration_minutes?: number | null
          entry_date?: string
          created_at?: string
        }
      }
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type TimesheetEntry = Database['public']['Tables']['timesheet_entries']['Row']
export type TimesheetEntryInsert = Database['public']['Tables']['timesheet_entries']['Insert']
export type TimesheetEntryUpdate = Database['public']['Tables']['timesheet_entries']['Update']