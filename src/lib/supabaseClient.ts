import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Singleton Supabase client. In demo mode this may be unused, but it's safe to initialize.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;

export const supabaseConfigured = Boolean(url && anonKey);
