import { createClient } from "@supabase/supabase-js";

import { env, hasSupabase } from "@/lib/env";

export function createServerSupabaseClient() {
  if (!hasSupabase()) {
    return null;
  }

  return createClient(
    env.NEXT_PUBLIC_SUPABASE_URL as string,
    env.SUPABASE_SERVICE_ROLE_KEY as string,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    },
  );
}
