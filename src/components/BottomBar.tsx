import type { Derived } from "../state";
import { formatINR } from "../catalog";

export function BottomBar({ derived }: { derived: Derived }) {
  const blocked = derived.errorCount > 0 || derived.validCount === 0;
  return (
    <div className="bottom-bar">
      <div className={`bottom-issues ${derived.errorCount ? "text-red" : ""}`}>
        {derived.validCount + derived.errorCount} lines ·{" "}
        {derived.errorCount ? `${derived.errorCount} issues` : "no issues"}
      </div>
      <div className="bottom-mid">
        Subtotal <strong>{formatINR(derived.subtotal)}</strong>
        <span className="dot-sep">·</span>
        Tax <strong>{formatINR(derived.tax)}</strong>
      </div>
      <div className="bottom-total-pill">
        <span>
          Grand Total <strong>{formatINR(derived.grandTotal)}</strong>
        </span>
        <button
          className="btn btn-invert"
          disabled={blocked}
          title={blocked ? `Resolve ${derived.errorCount} error(s) to submit` : undefined}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
