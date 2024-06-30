import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_REACT_NATIVE_SUPABASE_URL || "";
const supabaseAnonKey = process.env.EXPO_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
