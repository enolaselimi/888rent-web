import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          phone: string | null;
          is_admin: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          phone?: string | null;
          is_admin?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          phone?: string | null;
          is_admin?: boolean | null;
          created_at?: string | null;
        };
      };
      cars: {
        Row: {
          id: string;
          name: string;
          year: number;
          engine: string;
          fuel_type: string;
          transmission: string;
          price_per_day: number;
          image_url: string;
          description: string | null;
          features: any[] | null;
          available: boolean | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          name: string;
          year: number;
          engine: string;
          fuel_type: string;
          transmission: string;
          price_per_day: number;
          image_url: string;
          description?: string | null;
          features?: any[] | null;
          available?: boolean | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          name?: string;
          year?: number;
          engine?: string;
          fuel_type?: string;
          transmission?: string;
          price_per_day?: number;
          image_url?: string;
          description?: string | null;
          features?: any[] | null;
          available?: boolean | null;
          created_at?: string | null;
        };
      };
      reservations: {
        Row: {
          id: string;
          user_id: string | null;
          car_id: string | null;
          pickup_date: string;
          pickup_time: string;
          pickup_location: string;
          dropoff_date: string;
          dropoff_time: string;
          dropoff_location: string;
          full_name: string;
          email: string;
          phone: string;
          patent_document: string | null;
          total_amount: number;
          status: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          car_id?: string | null;
          pickup_date: string;
          pickup_time: string;
          pickup_location: string;
          dropoff_date: string;
          dropoff_time: string;
          dropoff_location: string;
          full_name: string;
          email: string;
          phone: string;
          patent_document?: string | null;
          total_amount: number;
          status?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          car_id?: string | null;
          pickup_date?: string;
          pickup_time?: string;
          pickup_location?: string;
          dropoff_date?: string;
          dropoff_time?: string;
          dropoff_location?: string;
          full_name?: string;
          email?: string;
          phone?: string;
          patent_document?: string | null;
          total_amount?: number;
          status?: string | null;
          created_at?: string | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          user_id: string | null;
          car_id: string | null;
          reservation_id: string | null;
          rating: number;
          comment: string;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          car_id?: string | null;
          reservation_id?: string | null;
          rating: number;
          comment: string;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          car_id?: string | null;
          reservation_id?: string | null;
          rating?: number;
          comment?: string;
          created_at?: string | null;
        };
      };
    };
  };
}