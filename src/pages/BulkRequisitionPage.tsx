import { useMemo, useReducer, useState } from "react";
import { derive, initialState, reducer } from "../state";
import { Stepper } from "../components/Stepper";
import { DetailsCard } from "../components/DetailsCard";
import { LinesTable, type LineFilter } from "../components/LinesTable";
import { SummarySidebar } from "../components/SummarySidebar";
import { BottomBar } from "../components/BottomBar";

export function BulkRequisitionPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [filter, setFilter] = useState<LineFilter>("all");
  const derived = useMemo(() => derive(state.lines), [state.lines]);

  const scrollToLine = (lineId: number) => {
    document
      .getElementById(`line-${lineId}`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <header className="page-header">
        <div className="page-header-left">
          <h1>Bulk Entry: Purchase Requisition</h1>
          <span className="badge badge-draft">DRAFT</span>
          <span className="doc-number">PR-2026-0091</span>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-danger-text">Discard</button>
          <button className="btn btn-secondary">Save Draft</button>
          <button
            className="btn btn-primary"
            disabled={derived.errorCount > 0 || derived.validCount === 0}
            title={
              derived.errorCount > 0
                ? `Resolve ${derived.errorCount} error(s) to submit`
                : undefined
            }
          >
            Submit for Approval
          </button>
        </div>
      </header>

      <Stepper currentStep={0} />

      <div className="content">
        <div className="content-left">
          <DetailsCard
            header={state.header}
            committed={derived.grandTotal}
            onChange={(patch) => dispatch({ type: "header", patch })}
          />
          <LinesTable
            lines={state.lines}
            selected={state.selected}
            filter={filter}
            derived={derived}
            onFilter={setFilter}
            dispatch={dispatch}
          />
        </div>
        <SummarySidebar
          header={state.header}
          lines={state.lines}
          derived={derived}
          onFixLine={scrollToLine}
        />
      </div>

      <BottomBar derived={derived} />
    </>
  );
}
