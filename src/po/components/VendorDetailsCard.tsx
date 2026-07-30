import type { VendorDetails } from "../types";

interface Props {
  vendor: VendorDetails;
  onChange: (patch: Partial<VendorDetails>) => void;
}

export function VendorDetailsCard({ vendor, onChange }: Props) {
  return (
    <section className="card">
      <h2 className="card-title">Vendor Details</h2>
      <div className="details-grid po-grid">
        <label className="field">
          <span className="field-label">Vendor</span>
          <input
            value={vendor.vendorName}
            onChange={(e) => onChange({ vendorName: e.target.value })}
            placeholder="Start typing vendor name…"
          />
        </label>

        <label className="field">
          <span className="field-label">GSTIN</span>
          <input
            value={vendor.gstin}
            onChange={(e) => onChange({ gstin: e.target.value })}
          />
        </label>

        <label className="field">
          <span className="field-label">Primary Contact</span>
          <input
            value={vendor.primaryContact}
            onChange={(e) => onChange({ primaryContact: e.target.value })}
          />
        </label>

        <label className="field">
          <span className="field-label">Email</span>
          <input
            type="email"
            value={vendor.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />
        </label>

        <label className="field">
          <span className="field-label">Billing Address</span>
          <textarea
            rows={3}
            value={vendor.billingAddress}
            onChange={(e) => onChange({ billingAddress: e.target.value })}
          />
        </label>

        <label className="field">
          <span className="field-label">Shipping Address</span>
          <textarea
            rows={3}
            value={vendor.shippingAddress}
            onChange={(e) => onChange({ shippingAddress: e.target.value })}
          />
        </label>

        <label className="field">
          <span className="field-label">Incoterms</span>
          <select
            value={vendor.incoterms}
            onChange={(e) => onChange({ incoterms: e.target.value })}
          >
            <option>DAP - Delivered at Place</option>
            <option>FOB - Free on Board</option>
            <option>EXW - Ex Works</option>
            <option>CIF - Cost, Insurance & Freight</option>
          </select>
        </label>
      </div>
    </section>
  );
}
