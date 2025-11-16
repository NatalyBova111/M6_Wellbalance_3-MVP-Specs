// lib/supabaseServer.ts
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/database.types';

type TypedSupabaseClient = SupabaseClient<Database>;

export function createSupabaseServer(): TypedSupabaseClient {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
