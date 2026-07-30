import type { POHeader, Priority } from "../types";

const PRIORITIES: Priority[] = ["Low", "Medium", "High"];

interface Props {
  header: POHeader;
  onChange: (patch: Partial<POHeader>) => void;
}

export function HeaderInfoCard({ header, onChange }: Props) {
  return (
    <section className="card">
      <h2 className="card-title">Header Information</h2>
      <div className="details-grid po-grid">
        <label className="field">
          <span className="field-label">PO Number</span>
          <input value={header.poNumber} readOnly className="field-readonly" />
        </label>

        <label className="field">
          <span className="field-label">Order Date</span>
          <input
            type="date"
            value={header.orderDate}
            onChange={(e) => onChange({ orderDate: e.target.value })}
          />
        </label>

        <label className="field">
          <span className="field-label">Expected Delivery</span>
          <input
            type="date"
            value={header.expectedDelivery}
            onChange={(e) => onChange({ expectedDelivery: e.target.value })}
          />
        </label>

        <label className="field">
          <span className="field-label">Payment Terms</span>
          <select
            value={header.paymentTerms}
            onChange={(e) => onChange({ paymentTerms: e.target.value })}
          >
            <option>Net 15</option>
            <option>Net 30</option>
            <option>Net 45</option>
            <option>Due on Receipt</option>
          </select>
        </label>

        <label className="field">
          <span className="field-label">Currency</span>
          <select
            value={header.currency}
            onChange={(e) => onChange({ currency: e.target.value })}
          >
            <option>INR ₹</option>
            <option>USD $</option>
            <option>EUR €</option>
          </select>
        </label>

        <label className="field">
          <span className="field-label">Warehouse</span>
          <select
            value={header.warehouse}
            onChange={(e) => onChange({ warehouse: e.target.value })}
          >
            <option>Central Warehouse - A1</option>
            <option>North Hub - B2</option>
            <option>South Hub - C1</option>
          </select>
        </label>

        <label className="field">
          <span className="field-label">Cost Center</span>
          <select
            value={header.costCenter}
            onChange={(e) => onChange({ costCenter: e.target.value })}
          >
            <option>IT-OPS</option>
            <option>FAC-02</option>
            <option>FIN-01</option>
          </select>
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
      </div>
    </section>
  );
}
