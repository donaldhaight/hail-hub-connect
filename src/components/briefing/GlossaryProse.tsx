import { useMemo, useState } from "react";

export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  see_also: string | null;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type Piece = { text: string; term?: GlossaryTerm };

/**
 * Split a paragraph into plain text and glossary-term pieces. Terms are matched
 * whole-word and case-insensitively, longest first so multi-word terms win.
 */
function splitParagraph(text: string, terms: GlossaryTerm[]): Piece[] {
  if (terms.length === 0) return [{ text }];
  const sorted = [...terms].sort((a, b) => b.term.length - a.term.length);
  const pattern = new RegExp(
    `\\b(${sorted.map((t) => escapeRegExp(t.term)).join("|")})\\b`,
    "gi",
  );
  const byLower = new Map(sorted.map((t) => [t.term.toLowerCase(), t] as const));

  const pieces: Piece[] = [];
  let last = 0;
  const seen = new Set<string>();
  for (const match of text.matchAll(pattern)) {
    const start = match.index ?? 0;
    const key = match[0].toLowerCase();
    const term = byLower.get(key);
    // Mark only the first occurrence of each term in a paragraph.
    if (!term || seen.has(key)) continue;
    seen.add(key);
    if (start > last) pieces.push({ text: text.slice(last, start) });
    pieces.push({ text: match[0], term });
    last = start + match[0].length;
  }
  if (last < text.length) pieces.push({ text: text.slice(last) });
  return pieces;
}

function TermMark({ term }: { term: GlossaryTerm }) {
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="cursor-help border-b border-dotted border-navy/60 text-inherit"
        aria-expanded={open}
      >
        {term.term}
      </button>
      {open ? (
        <span className="absolute left-0 top-[calc(100%+6px)] z-30 block w-72 border border-border bg-paper p-3 text-left shadow-lg">
          <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-silver">
            {term.term}
          </span>
          <span className="mt-1.5 block text-sm leading-relaxed text-ink/85">
            {term.definition}
          </span>
          {term.see_also ? (
            <span className="mt-1.5 block font-mono text-[10px] uppercase tracking-[0.14em] text-silver">
              See also: {term.see_also}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}

export function GlossaryParagraph({
  text,
  terms,
}: {
  text: string;
  terms: GlossaryTerm[];
}) {
  const pieces = useMemo(() => splitParagraph(text, terms), [text, terms]);
  return (
    <p className="text-pretty">
      {pieces.map((piece, i) =>
        piece.term ? (
          <TermMark key={i} term={piece.term} />
        ) : (
          <span key={i}>{piece.text}</span>
        ),
      )}
    </p>
  );
}
