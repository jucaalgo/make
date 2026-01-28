import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supply VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable backend features.');
}

/**
 * Global Supabase Client for Antigravity Ecosystem
 * Shared across Architect, Sales, and Marketing apps.
 */
export const supabase = createClient(supabaseUrl || '', supabaseKey || '');

/**
 * Helper to identify which app is currently running.
 * This should be configured per-project.
 */
export const APP_ID = 'antigravity-architect'; // Change this for other apps
