import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database Types
export interface SadPathCategory {
  id: number
  category_name: string
  created_at?: string
}

export interface SadPathSubcategory {
  id: number
  subcategory_name: string
  category_id: number
  created_at?: string
}

export interface UserCustomValue {
  id?: number
  email: string
  chart_type: string
  chart_data: any
  created_at?: string
  updated_at?: string
}

