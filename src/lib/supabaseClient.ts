// src/lib/supabaseClient.ts
"use client";

import { createClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import { useMemo } from "react";

export function useSupabaseBrowser() {
  const { session } = useSession();

  // useMemo ensures the client is created only once per session
  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        // The accessToken function is called for every request
        // and supplies the latest Clerk session token.
        fetch: async (url, options = {}) => {
          const clerkToken = await session?.getToken({
            template: "supabase",
          });

          const headers = new Headers(options.headers);
          headers.set("Authorization", `Bearer ${clerkToken}`);

          return fetch(url, { ...options, headers });
        },
      },
    });
  }, [session]);

  return supabase;
}