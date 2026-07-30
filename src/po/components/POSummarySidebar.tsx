import type { PODerived } from "../state";
import { formatINR } from "../../catalog";

const APPROVERS = [
  { role: "Procurement Manager", name: "Priya S", note: "" },
  { role: "Finance Head", name: "Arjun Mehta", note: "" },
  { role: "Director", name: "", note: "Required above ₹5,00,000" },
];

interface Props {
  derived: PODerived;
  onFixLine: (lineId: number) => void;
}

export function POSummarySidebar({ derived, onFixLine }: Props) {
  return (
    <aside className="summary-col">
      <section className="card">
        <h3 className="card-title">Order Summary</h3>
        <dl className="summary-list">
          <div>
            <dt>No. of Lines</dt>
            <dd>{derived.validCount + derived.errorCount}</dd>
          </div>
          <div>
            <dt>Total Qty</dt>
            <dd>{derived.totalQty}</dd>
          </div>
          <div>
            <dt>Subtotal</dt>
            <dd>{formatINR(derived.taxableTotal)}</dd>
          </div>
          <div>
            <dt>Tax</dt>
            <dd>{formatINR(derived.cgst + derived.sgst)}</dd>
          </div>
          <div className="summary-total">
            <dt>Grand Total</dt>
            <dd>{formatINR(derived.grandTotal)}</dd>
          </div>
        </dl>
      </section>

      <section className="card">
        <h3 className="card-title">Validation</h3>
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
        <h3 className="card-title">Approval Workflow</h3>
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

      <section className="card">
        <h3 className="card-title">Audit</h3>
        <p className="audit-line">
          Created by <strong>Alex Rivera</strong> · 29 Jul 2026
        </p>
        <p className="audit-line">Last edited 5 min ago</p>
      </section>
    </aside>
  );
}
