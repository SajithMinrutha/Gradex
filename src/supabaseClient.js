// src/supabaseClient.js
import { createClient } from "@supabase/supabase-js";

// Your Supabase project URL (replace with your actual project URL)
const supabaseUrl = "https://vqqnrbkzikiphmvrzvxb.supabase.co";

// Your publishable (anon) key
const supabaseKey = "sb_publishable_fxxrIPnWYHwTOQoZXo5ONw_oIB5Osc_";

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseKey);
