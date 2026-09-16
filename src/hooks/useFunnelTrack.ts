import { useEffect, useState } from "react";
import { FUNNEL_TRACK_STORAGE_KEY, FUNNEL_TRACKS } from "@/content/funnels";

/**
 * The Phase 1 funnel track a person arrived on, remembered in their own
 * browser. Read after mount so server and client render the same first pass.
 * It is a framing choice — never a role, a permission, or a record.
 */
export function useFunnelTrack(): string | null {
  const [track, setTrack] = useState<string | null>(null);
  useEffect(() => {
    const stored = window.localStorage.getItem(FUNNEL_TRACK_STORAGE_KEY);
    if (stored && FUNNEL_TRACKS[stored]) setTrack(stored);
  }, []);
  return track;
}
