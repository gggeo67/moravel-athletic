/**
 * Shared shape for the order form state.
 *
 * Deliberately NOT in the "use server" action module: those files may only
 * export async functions, so exporting an object from there fails at runtime.
 */
export interface OrderState {
  status: "idle" | "error";
  message: string;
  /** Field that failed validation, for focus and highlighting. */
  field?: string;
  /**
   * What the customer typed, echoed back on every error path.
   *
   * React resets uncontrolled fields once a form action returns, and returning
   * an error counts as returning. Without this the customer loses their whole
   * address every time the register is closed or a field fails validation.
   * The form feeds these back through `defaultValue`, so React's reset restores
   * them instead of blanking them.
   */
  values?: Record<string, string>;
}

export const initialOrderState: OrderState = {
  status: "idle",
  message: "",
};
