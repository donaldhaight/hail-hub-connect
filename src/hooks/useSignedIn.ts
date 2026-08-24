import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * useSignedIn — lightweight auth-presence signal for public pages that
 * reveal insider-only detail (brand names, domains) once a visitor is
 * authenticated. Returns null until the session check resolves so callers
 * can render the redacted variant during SSR/hydration.
 */
export function useSignedIn(): boolean | null {
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (active) setSignedIn(!!data.session);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return signedIn;
}
