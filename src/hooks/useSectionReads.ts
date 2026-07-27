import { useCallback, useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { recordSectionReads, listMySectionReads } from "@/lib/section-reads.functions";

type Read = {
  dwell_ms: number;
  read_confirmed_at: string | null;
};

export function useSectionReads(slug: string) {
  const record = useServerFn(recordSectionReads);
  const listMine = useServerFn(listMySectionReads);

  const [state, setState] = useState<Record<string, Read>>({});
  const pending = useRef<Map<string, number>>(new Map());
  const visibleSince = useRef<Map<string, number>>(new Map());
  const observers = useRef<Map<string, IntersectionObserver>>(new Map());

  const refresh = useCallback(() => {
    listMine({ data: { slug } })
      .then((r) => setState(r.bySection))
      .catch(() => {});
  }, [listMine, slug]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const flush = useCallback(
    async (confirmedId?: string) => {
      const now = Date.now();
      // Roll active visible timers into pending.
      for (const [id, t] of visibleSince.current) {
        const add = Math.max(0, now - t);
        pending.current.set(id, (pending.current.get(id) ?? 0) + add);
        visibleSince.current.set(id, now);
      }
      const reads: Array<{ sectionId: string; dwellMs: number; confirmed?: boolean }> = [];
      for (const [id, ms] of pending.current) {
        reads.push({ sectionId: id, dwellMs: ms, confirmed: confirmedId === id });
      }
      if (confirmedId && !pending.current.has(confirmedId)) {
        reads.push({ sectionId: confirmedId, dwellMs: 0, confirmed: true });
      }
      if (reads.length === 0) return;
      pending.current.clear();
      try {
        await record({ data: { slug, reads } });
        refresh();
      } catch {
        // swallow; will retry next flush
      }
    },
    [record, refresh, slug],
  );

  // Periodic flush + on unload.
  useEffect(() => {
    const interval = window.setInterval(() => {
      flush();
    }, 10000);
    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onHide);
      flush();
    };
  }, [flush]);

  const observe = useCallback(
    (sectionId: string, node: HTMLElement | null) => {
      if (!node) {
        const existing = observers.current.get(sectionId);
        if (existing) {
          existing.disconnect();
          observers.current.delete(sectionId);
        }
        visibleSince.current.delete(sectionId);
        return;
      }
      if (observers.current.has(sectionId)) return;
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const now = Date.now();
            if (e.isIntersecting && e.intersectionRatio >= 0.5) {
              if (!visibleSince.current.has(sectionId)) {
                visibleSince.current.set(sectionId, now);
              }
            } else {
              const t = visibleSince.current.get(sectionId);
              if (t) {
                const add = Math.max(0, now - t);
                pending.current.set(sectionId, (pending.current.get(sectionId) ?? 0) + add);
                visibleSince.current.delete(sectionId);
              }
            }
          }
        },
        { threshold: [0, 0.5, 1] },
      );
      io.observe(node);
      observers.current.set(sectionId, io);
    },
    [],
  );

  const confirm = useCallback(
    (sectionId: string) => {
      flush(sectionId);
    },
    [flush],
  );

  return { state, observe, confirm };
}

export function formatDwell(ms: number): string {
  if (ms < 1000) return "";
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m`;
}
