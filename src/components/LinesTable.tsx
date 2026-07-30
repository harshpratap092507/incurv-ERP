import type { Dispatch } from "react";
import type { RequisitionLine } from "../types";
import type { Action, Derived } from "../state";
import { lineStatus } from "../state";
import { CATALOG, UNITS, formatINR } from "../catalog";

export type LineFilter = "all" | "valid" | "errors";

interface Props {
  lines: RequisitionLine[];
  selected: Set<number>;
  filter: LineFilter;
  derived: Derived;
  onFilter: (filter: LineFilter) => void;
  dispatch: Dispatch<Action>;
}

export function LinesTable({
  lines,
  selected,
  filter,
  derived,
  onFilter,
  dispatch,
}: Props) {
  const visible = lines.filter((line) => {
    if (filter === "all") return true;
    const status = lineStatus(line);
    return filter === "valid" ? status.kind === "valid" : status.kind === "error";
  });

  const allSelected = lines.length > 0 && lines.every((l) => selected.has(l.id));

  return (
    <section className="card table-card">
      <div className="table-toolbar">
        <div className="toolbar-left">
          <button className="btn btn-secondary" onClick={() => dispatch({ type: "addLine" })}>
            + Add Row
          </button>
          <button className="btn btn-secondary" title="Demo stub">Import CSV</button>
          <button className="btn btn-secondary" title="Demo stub">Download Template</button>
          {selected.size > 0 && (
            <button
              className="btn btn-danger-text"
              onClick={() => dispatch({ type: "deleteSelected" })}
            >
              Delete Selected ({selected.size})
            </button>
          )}
        </div>
        <div className="filter-tabs">
          {(
            [
              ["all", `All (${lines.length})`],
              ["valid", `Valid (${derived.validCount})`],
              ["errors", `Errors (${derived.errorCount})`],
            ] as [LineFilter, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              className={`filter-tab ${filter === key ? "filter-tab-active" : ""} ${
                key === "errors" && derived.errorCount > 0 ? "filter-tab-error" : ""
              }`}
              onClick={() => onFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="table-scroll">
        <table className="lines-table">
          <colgroup>
            <col className="col-check" />
            <col className="col-num" />
            <col className="col-code" />
            <col className="col-desc" />
            <col className="col-qty" />
            <col className="col-unit" />
            <col className="col-price" />
            <col className="col-tax" />
            <col className="col-gl" />
            <col className="col-date" />
            <col className="col-status" />
            <col className="col-actions" />
          </colgroup>
          <thead>
            <tr>
              <th className="col-check">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={() => dispatch({ type: "toggleSelectAll" })}
                />
              </th>
              <th className="col-num">#</th>
              <th className="col-code">Item Code</th>
              <th className="col-desc">Description</th>
              <th className="col-qty">Qty</th>
              <th className="col-unit">Unit</th>
              <th className="col-price">Est. Unit Price</th>
              <th className="col-tax">Tax %</th>
              <th className="col-gl">GL Account</th>
              <th className="col-date">Required Date</th>
              <th className="col-status">Status</th>
              <th className="col-actions" />
            </tr>
          </thead>
          <tbody>
            {visible.map((line) => {
              const status = lineStatus(line);
              const rowIndex = lines.indexOf(line) + 1;
              return (
                <tr
                  key={line.id}
                  id={`line-${line.id}`}
                  className={status.kind === "error" ? "row-error" : ""}
                >
                  <td className="col-check">
                    <input
                      type="checkbox"
                      checked={selected.has(line.id)}
                      onChange={() => dispatch({ type: "toggleSelect", id: line.id })}
                    />
                  </td>
                  <td className="col-num">{rowIndex}</td>
                  <td>
                    <input
                      className="cell-input"
                      list="catalog-codes"
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
                  <td className="col-unit">
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
                            unitPrice:
                              e.target.value === "" ? null : Number(e.target.value),
                          },
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
                      value={line.glAccount}
                      placeholder="Auto from item"
                      onChange={(e) =>
                        dispatch({
                          type: "updateLine",
                          id: line.id,
                          patch: { glAccount: e.target.value },
                        })
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="cell-input"
                      type="date"
                      value={line.requiredDate}
                      onChange={(e) =>
                        dispatch({
                          type: "updateLine",
                          id: line.id,
                          patch: { requiredDate: e.target.value },
                        })
                      }
                    />
                  </td>
                  <td>
                    {status.kind === "valid" && (
                      <span className="status-chip status-valid">Valid</span>
                    )}
                    {status.kind === "error" && (
                      <span className="status-chip status-error">{status.message}</span>
                    )}
                    {status.kind === "empty" && (
                      <span className="status-chip status-empty">Empty</span>
                    )}
                  </td>
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
            {visible.length === 0 && (
              <tr>
                <td colSpan={12} className="empty-row">
                  No lines match this filter.
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={4} />
              <td className="col-qty foot-num">{derived.totalQty}</td>
              <td colSpan={5} />
              <td colSpan={2} className="foot-total">
                {formatINR(derived.subtotal)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <datalist id="catalog-codes">
        {CATALOG.map((item) => (
          <option key={item.code} value={item.code}>
            {item.description}
          </option>
        ))}
      </datalist>

      <button className="add-row-ghost" onClick={() => dispatch({ type: "addLine" })}>
        ⊕ Add New Empty Row
      </button>
    </section>
  );
}
