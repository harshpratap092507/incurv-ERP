import type { Dispatch } from "react";
import type { POAction, PODerived } from "../state";
import { poLineStatus, computePOLine } from "../state";
import type { POLine } from "../types";
import { CATALOG, UNITS, formatINR } from "../../catalog";

interface Props {
  lines: POLine[];
  derived: PODerived;
  dispatch: Dispatch<POAction>;
}

export function POLinesTable({ lines, derived, dispatch }: Props) {
  return (
    <section className="card table-card">
      <div className="table-toolbar">
        <h2 className="card-title" style={{ margin: 0 }}>
          Order Line Items
        </h2>
        <button className="btn btn-secondary" onClick={() => dispatch({ type: "addLine" })}>
          + Add Row
        </button>
      </div>

      <div className="table-scroll">
        <table className="lines-table po-lines-table">
          <colgroup>
            <col className="col-num" />
            <col className="col-code" />
            <col className="col-desc" />
            <col className="col-qty" />
            <col className="col-unit" />
            <col className="col-price" />
            <col className="col-disc" />
            <col className="col-tax" />
            <col className="col-date" />
            <col className="col-lineTotal" />
            <col className="col-actions" />
          </colgroup>
          <thead>
            <tr>
              <th className="col-num">#</th>
              <th className="col-code">Item Code</th>
              <th className="col-desc">Description</th>
              <th className="col-qty">Qty</th>
              <th className="col-unit">Unit</th>
              <th className="col-price">Unit Price</th>
              <th className="col-disc">Disc %</th>
              <th className="col-tax">Tax %</th>
              <th className="col-date">Delivery Date</th>
              <th className="col-lineTotal">Total</th>
              <th className="col-actions" />
            </tr>
          </thead>
          <tbody>
            {lines.map((line, index) => {
              const status = poLineStatus(line);
              const computed = computePOLine(line);
              return (
                <tr
                  key={line.id}
                  data-line-id={line.id}
                  className={status.kind === "error" ? "row-error" : ""}
                >
                  <td className="col-num">{index + 1}</td>
                  <td>
                    <input
                      className="cell-input"
                      list="po-catalog-codes"
                      value={line.itemCode}
                      placeholder="Start typing code…"
                      onChange={(e) =>
                        dispatch({ type: "setItemCode", id: line.id, code: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="cell-input"
                      value={line.description}
                      placeholder="System lookup…"
                      onChange={(e) =>
                        dispatch({
                          type: "updateLine",
                          id: line.id,
                          patch: { description: e.target.value },
                        })
                      }
                    />
                  </td>
                  <td className="col-qty">
                    <input
                      className="cell-input cell-num"
                      type="number"
                      min={0}
                      value={line.qty}
                      onChange={(e) =>
                        dispatch({
                          type: "updateLine",
                          id: line.id,
                          patch: { qty: Number(e.target.value) },
                        })
                      }
                    />
                  </td>
                  <td>
                    <select
                      className="cell-input cell-select"
                      value={line.unit}
                      onChange={(e) =>
                        dispatch({
                          type: "updateLine",
                          id: line.id,
                          patch: { unit: e.target.value },
                        })
                      }
                    >
                      {UNITS.map((unit) => (
                        <option key={unit}>{unit}</option>
                      ))}
                    </select>
                  </td>
                  <td className="col-price">
                    <input
                      className={`cell-input cell-num ${
                        status.kind === "error" && line.unitPrice == null
                          ? "cell-input-error"
                          : ""
                      }`}
                      type="number"
                      min={0}
                      value={line.unitPrice ?? ""}
                      placeholder="—"
                      onChange={(e) =>
                        dispatch({
                          type: "updateLine",
                          id: line.id,
                          patch: {
                            unitPrice: e.target.value === "" ? null : Number(e.target.value),
                          },
                        })
                      }
                    />
                  </td>
                  <td className="col-disc">
                    <input
                      className="cell-input cell-num"
                      type="number"
                      min={0}
                      max={100}
                      value={line.discountPct}
                      onChange={(e) =>
                        dispatch({
                          type: "updateLine",
                          id: line.id,
                          patch: { discountPct: Number(e.target.value) },
                        })
                      }
                    />
                  </td>
                  <td className="col-tax">
                    <input
                      className="cell-input cell-num"
                      type="number"
                      min={0}
                      max={100}
                      value={line.taxPct}
                      onChange={(e) =>
                        dispatch({
                          type: "updateLine",
                          id: line.id,
                          patch: { taxPct: Number(e.target.value) },
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="cell-input"
                      type="date"
                      value={line.deliveryDate}
                      onChange={(e) =>
                        dispatch({
                          type: "updateLine",
                          id: line.id,
                          patch: { deliveryDate: e.target.value },
                        })
                      }
                    />
                  </td>
                  <td className="col-lineTotal foot-num">{formatINR(computed.total)}</td>
                  <td className="col-actions">
                    <button
                      className="icon-btn"
                      title="Duplicate row"
                      onClick={() => dispatch({ type: "duplicateLine", id: line.id })}
                    >
                      ⧉
                    </button>
                    <button
                      className="icon-btn icon-btn-danger"
                      title="Delete row"
                      onClick={() => dispatch({ type: "deleteLine", id: line.id })}
                    >
                      🗑
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <datalist id="po-catalog-codes">
        {CATALOG.map((item) => (
          <option key={item.code} value={item.code}>
            {item.description}
          </option>
        ))}
      </datalist>

      <div className="po-totals">
        <div>
          <span>Subtotal</span>
          <strong>{formatINR(derived.grossTotal)}</strong>
        </div>
        <div>
          <span>Discount</span>
          <strong className="text-red">- {formatINR(derived.discountTotal)}</strong>
        </div>
        <div>
          <span>CGST (9%)</span>
          <strong>{formatINR(derived.cgst)}</strong>
        </div>
        <div>
          <span>SGST (9%)</span>
          <strong>{formatINR(derived.sgst)}</strong>
        </div>
        <div className="po-grand-total">
          <span>Grand Total</span>
          <strong>{formatINR(derived.grandTotal)}</strong>
        </div>
      </div>
    </section>
  );
}
