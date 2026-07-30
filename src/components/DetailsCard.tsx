import type { Priority, RequisitionHeader } from "../types";
import { formatINR } from "../catalog";

const PRIORITIES: Priority[] = ["Low", "Medium", "High"];

interface Props {
  header: RequisitionHeader;
  committed: number;
  onChange: (patch: Partial<RequisitionHeader>) => void;
}

export function DetailsCard({ header, committed, onChange }: Props) {
  const remainingPct = Math.max(
    0,
    Math.round(((header.budgetAvailable - committed) / header.budgetAvailable) * 100)
  );

  return (
    <section className="card details-card">
      <h2 className="card-title">Requisition Details</h2>
      <div className="details-grid">
        <label className="field">
          <span className="field-label">Requested By</span>
          <input
            value={header.requestedBy}
            onChange={(e) => onChange({ requestedBy: e.target.value })}
          />
        </label>

        <label className="field">
          <span className="field-label">Department</span>
          <select
            value={header.department}
            onChange={(e) => onChange({ department: e.target.value })}
          >
            <option>IT Operations</option>
            <option>Facilities</option>
            <option>Finance</option>
            <option>Human Resources</option>
          </select>
        </label>

        <label className="field">
          <span className="field-label">Cost Center</span>
          <select
            value={header.costCenter}
            onChange={(e) => onChange({ costCenter: e.target.value })}
          >
            <option>IT-OPS-01</option>
            <option>FAC-02</option>
            <option>FIN-01</option>
          </select>
        </label>

        <label className="field">
          <span className="field-label">Required By</span>
          <input
            type="date"
            value={header.requiredBy}
            onChange={(e) => onChange({ requiredBy: e.target.value })}
          />
        </label>

        <div className="field">
          <span className="field-label">Priority</span>
          <div className="chip-group">
            {PRIORITIES.map((priority) => (
              <button
                key={priority}
                type="button"
                className={`chip ${
                  header.priority === priority
                    ? `chip-active chip-${priority.toLowerCase()}`
                    : ""
                }`}
                onClick={() => onChange({ priority })}
              >
                {priority}
              </button>
            ))}
          </div>
        </div>

        <div className="field">
          <span className="field-label">Budget</span>
          <div className="budget-box">
            <span>{formatINR(header.budgetAvailable)} available</span>
            <div className="progress-track">
              <div
                className="progress-fill progress-green"
                style={{ width: `${remainingPct}%` }}
              />
            </div>
            <span className="budget-note">{remainingPct}% remaining</span>
          </div>
        </div>

        <label className="field">
          <span className="field-label">Preferred Vendor (optional)</span>
          <input
            value={header.preferredVendor}
            onChange={(e) => onChange({ preferredVendor: e.target.value })}
            placeholder="Start typing vendor name…"
          />
        </label>

        <label className="field field-wide">
          <span className="field-label">Justification</span>
          <textarea
            rows={2}
            value={header.justification}
            onChange={(e) => onChange({ justification: e.target.value })}
          />
        </label>
      </div>
    </section>
  );
}
