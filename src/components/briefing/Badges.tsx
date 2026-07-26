import type { ReactNode } from "react";

export type TruthClass =
  | "FACT"
  | "ASSERTION"
  | "DECISION"
  | "HYPOTHESIS"
  | "SIMULATION"
  | "OPEN";

export type ConfidentialityClass = "C0" | "C1" | "C2" | "C3" | "C4";

const TRUTH_LABEL: Record<TruthClass, string> = {
  FACT: "Fact",
  ASSERTION: "Assertion",
  DECISION: "Decision",
  HYPOTHESIS: "Hypothesis",
  SIMULATION: "Simulation",
  OPEN: "Open Question",
};

const CONF_LABEL: Record<ConfidentialityClass, string> = {
  C0: "C0 · Introductory",
  C1: "C1 · Confidential Business",
  C2: "C2 · Restricted Diligence",
  C3: "C3 · Privileged",
  C4: "C4 · Regulated",
};

const CHIP_BASE =
  "inline-flex items-center gap-1.5 border px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] font-mono";

export function TruthChip({ value }: { value: TruthClass }) {
  return (
    <span className={`${CHIP_BASE} border-border bg-muted text-muted-foreground`}>
      <span className="h-1 w-1 rounded-full bg-navy" aria-hidden />
      {TRUTH_LABEL[value]}
    </span>
  );
}

export function ConfidentialityChip({ value }: { value: ConfidentialityClass }) {
  return (
    <span className={`${CHIP_BASE} border-ink/30 bg-ink text-paper`}>
      {CONF_LABEL[value]}
    </span>
  );
}

export function StatusChip({ children }: { children: ReactNode }) {
  return (
    <span className={`${CHIP_BASE} border-navy/40 bg-transparent text-navy`}>
      {children}
    </span>
  );
}

export function Meta({
  truth,
  confidentiality,
  status,
}: {
  truth?: TruthClass;
  confidentiality?: ConfidentialityClass;
  status?: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {confidentiality ? <ConfidentialityChip value={confidentiality} /> : null}
      {truth ? <TruthChip value={truth} /> : null}
      {status ? <StatusChip>{status}</StatusChip> : null}
    </div>
  );
}
