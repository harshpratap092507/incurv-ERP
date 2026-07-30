import type { RequisitionHeader, RequisitionLine } from "../types";
import type { Derived } from "../state";
import { formatINR } from "../catalog";

const APPROVERS = [
  { role: "Department Head", name: "Meera N", note: "" },
  { role: "Procurement Manager", name: "Vikram S", note: "" },
  { role: "Finance", name: "", note: "above ₹5,00,000 — required" },
];

interface Props {
  header: RequisitionHeader;
  lines: RequisitionLine[];
  derived: Derived;
  onFixLine: (lineId: number) => void;
}

export function SummarySidebar({ header, lines, derived, onFixLine }: Props) {
  const withinBudget = derived.grandTotal <= header.budgetAvailable;
  const budgetPct = Math.min(
    100,
    Math.round((derived.grandTotal / header.budgetAvailable) * 100)
  );

  return (
    <aside className="summary-col">
      <section className="card">
        <h3 className="card-title">Requisition Summary</h3>
        <dl className="summary-list">
          <div>
            <dt>Total Lines</dt>
            <dd>{lines.length}</dd>
          </div>
          <div>
            <dt>Valid</dt>
            <dd className="text-green">{derived.validCount}</dd>
          </div>
          <div>
            <dt>Errors</dt>
            <dd className={derived.errorCount ? "text-red" : ""}>
              {derived.errorCount}
            </dd>
          </div>
          <div>
            <dt>Total Qty</dt>
            <dd>{derived.totalQty}</dd>
          </div>
          <div>
            <dt>Subtotal</dt>
            <dd>{formatINR(derived.subtotal)}</dd>
          </div>
          <div>
            <dt>Tax</dt>
            <dd>{formatINR(derived.tax)}</dd>
          </div>
          <div className="summary-total">
            <dt>Grand Total</dt>
            <dd>{formatINR(derived.grandTotal)}</dd>
          </div>
        </dl>
      </section>

      <section className="card">
        <h3 className="card-title">Budget Check</h3>
        <div className="progress-track">
          <div
            className={`progress-fill ${withinBudget ? "progress-green" : "progress-red"}`}
            style={{ width: `${budgetPct}%` }}
          />
        </div>
        <p className={`budget-status ${withinBudget ? "text-green" : "text-red"}`}>
          {formatINR(derived.grandTotal)} of {formatINR(header.budgetAvailable)} —{" "}
          {withinBudget ? "within budget ✓" : "over budget ✕"}
        </p>
      </section>

      <section className="card">
        <h3 className="card-title">Validation Issues</h3>
        {derived.issues.length === 0 ? (
          <p className="text-green validation-ok">✓ All lines valid</p>
        ) : (
          <ul className="issue-list">
            {derived.issues.map((issue) => (
              <li key={`${issue.lineId}-${issue.message}`}>
                <span className="issue-dot">!</span>
                <span>
                  Line {issue.lineNo}: {issue.message}
                </span>
                <button className="link-btn" onClick={() => onFixLine(issue.lineId)}>
                  Fix
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card">
        <h3 className="card-title">Approval Preview</h3>
        <ol className="approval-list">
          {APPROVERS.map((approver) => (
            <li key={approver.role}>
              <span className="approver-avatar">
                {(approver.name || approver.role)
                  .split(" ")
                  .map((word) => word[0])
                  .slice(0, 2)
                  .join("")}
              </span>
              <span className="approver-info">
                <strong>{approver.role}</strong>
                <small>{approver.name || approver.note}</small>
              </span>
              <span className="badge badge-pending">Pending</span>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}
