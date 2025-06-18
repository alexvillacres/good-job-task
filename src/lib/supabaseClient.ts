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

    // This is the new, correct way to initialize the client
    return createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        fetch: async (url, options = {}) => {
          // If the user is not signed in, session will be null.
          // We can just use the anon key in this case.
          if (!session) {
            return fetch(url, options);
          }

          // Otherwise, get the session token.
          // Notice we are NOT passing a template here.
          const clerkToken = await session.getToken();

          // And inject it into the Authorization header.
          const headers = new Headers(options.headers);
          headers.set("Authorization", `Bearer ${clerkToken}`);

          return fetch(url, { ...options, headers });
        },
      },
    });
  }, [session]);

  return supabase;
}