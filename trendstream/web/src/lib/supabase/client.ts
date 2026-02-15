
import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use a singleton instance or recreate as needed based on framework requirements (SSR vs Client)
// For MVP Client Component usage:
export const supabase = createClient(supabaseUrl, supabaseKey);
