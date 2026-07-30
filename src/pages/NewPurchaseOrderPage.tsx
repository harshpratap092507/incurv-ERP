import { useMemo, useReducer } from "react";
import { derivePO, initialPOState, poReducer } from "../po/state";
import { Stepper } from "../components/Stepper";
import { HeaderInfoCard } from "../po/components/HeaderInfoCard";
import { VendorDetailsCard } from "../po/components/VendorDetailsCard";
import { POLinesTable } from "../po/components/POLinesTable";
import { POSummarySidebar } from "../po/components/POSummarySidebar";
import { RemarksAttachments } from "../po/components/RemarksAttachments";

export function NewPurchaseOrderPage() {
  const [state, dispatch] = useReducer(poReducer, initialPOState);
  const derived = useMemo(() => derivePO(state.lines), [state.lines]);

  const scrollToLine = (lineId: number) => {
    document
      .querySelector(`[data-line-id="${lineId}"]`)
      ?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <header className="page-header">
        <div className="page-header-left">
          <h1>New Purchase Order</h1>
          <span className="badge badge-draft">DRAFT</span>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary">Print / Export</button>
          <button className="btn btn-secondary">Save as Draft</button>
          <button
            className="btn btn-primary"
            disabled={derived.errorCount > 0 || derived.validCount === 0}
            title={
              derived.errorCount > 0
                ? `Resolve ${derived.errorCount} error(s) to submit`
                : undefined
            }
          >
            Send for Approval
          </button>
        </div>
      </header>

      <Stepper currentStep={1} />

      <div className="content">
        <div className="content-left">
          <div className="po-two-col">
            <HeaderInfoCard
              header={state.header}
              onChange={(patch) => dispatch({ type: "header", patch })}
            />
            <VendorDetailsCard
              vendor={state.vendor}
              onChange={(patch) => dispatch({ type: "vendor", patch })}
            />
          </div>

          <POLinesTable lines={state.lines} derived={derived} dispatch={dispatch} />

          <RemarksAttachments />
        </div>

        <POSummarySidebar derived={derived} onFixLine={scrollToLine} />
      </div>
    </>
  );
}
