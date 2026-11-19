export type ReviewAction = "confirm" | "reject" | "merge" | "escalate";

export interface ReviewDecisionInput {
  ref: string;
  action: ReviewAction;
  rationale: string;
  /** Merge only: the report this one is merged into. */
  targetRef?: string;
  /** Escalate only: why it is sent on. */
  reason?: string;
}

/**
 * Sends a decision to the review backend. The backend checks the caller's role
 * and owns every status change; it rejects (throws) when it does not accept the
 * decision. A decision never creates or removes an official closure.
 */
export type ReviewDecisionAdapter = (
  input: ReviewDecisionInput,
) => Promise<void>;

export const REVIEW_ACTIONS: readonly ReviewAction[] = [
  "confirm",
  "reject",
  "merge",
  "escalate",
];
