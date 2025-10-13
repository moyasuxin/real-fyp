// src/services/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

// ✅ Environment variables (never hardcode your keys)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ✅ Create a single Supabase client instance for the whole app
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
