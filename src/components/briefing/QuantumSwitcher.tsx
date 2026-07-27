import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { BRANDS, VERTICAL_ORDER } from "@/content/brands";

/**
 * QuantumSwitcher — persistent dropdown in the header that lets any
 * visitor (public or insider) jump between the seven brand front doors,
 * grouped by vertical in the Metatron 7-position order.
 */
export function QuantumSwitcher({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (variant === "mobile") {
    return (
      <div className="py-2">
        <div className="pb-2 text-[10px] font-mono uppercase tracking-[0.22em] text-silver">
          Quantum Dashboard
        </div>
        <ul className="divide-y divide-border">
          {VERTICAL_ORDER.map((vertical) => {
            const brand = BRANDS.find((b) => b.vertical === vertical);
            if (!brand) return null;
            return (
              <li key={brand.id}>
                <Link
                  to="/b/$slug"
                  params={{ slug: brand.slug }}
                  className="flex items-center justify-between py-2.5 text-[14px] text-ink"
                >
                  <span>
                    <span className="text-silver">{brand.vertical}</span>
                    <span className="mx-2 text-silver">·</span>
                    <span>{brand.brandName}</span>
                  </span>
                  <span aria-hidden className="text-silver">→</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="inline-flex items-center gap-1.5 text-[12px] font-mono uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-ink"
      >
        Quantum Dashboard
        <ChevronDown className="h-3 w-3" />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-[320px] border border-border bg-background shadow-lg"
        >
          <div className="border-b border-border px-4 py-3 text-[10px] font-mono uppercase tracking-[0.22em] text-silver">
            The seven stakeholder groups
          </div>
          <ul className="max-h-[70vh] overflow-y-auto">
            {VERTICAL_ORDER.map((vertical) => {
              const brand = BRANDS.find((b) => b.vertical === vertical);
              if (!brand) return null;
              return (
                <li key={brand.id}>
                  <Link
                    to="/b/$slug"
                    params={{ slug: brand.slug }}
                    onClick={() => setOpen(false)}
                    className="flex items-start justify-between gap-3 border-b border-border px-4 py-3 hover:bg-muted"
                  >
                    <span className="min-w-0">
                      <span className="block text-[10px] font-mono uppercase tracking-[0.2em] text-silver">
                        {brand.vertical}
                      </span>
                      <span className="block truncate font-serif text-[15px] text-ink">
                        {brand.brandName}
                      </span>
                      <span className="block truncate font-mono text-[11px] text-muted-foreground">
                        {brand.domain}
                      </span>
                    </span>
                    <span className="whitespace-nowrap border border-border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
                      {brand.status}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link
            to="/architecture"
            onClick={() => setOpen(false)}
            className="block px-4 py-3 text-[11px] font-mono uppercase tracking-[0.18em] text-navy hover:bg-muted"
          >
            View architecture — 1 · 17 · 3,350 →
          </Link>
        </div>
      ) : null}
    </div>
  );
}
