import { useLocation } from "react-router-dom";

const BREADCRUMBS: Record<string, { section: string; page: string }> = {
  "/": { section: "Requisitions", page: "Bulk Entry" },
  "/newPurchase": { section: "Purchase Orders", page: "New PO" },
};

export function TopBar() {
  const location = useLocation();
  const crumb = BREADCRUMBS[location.pathname] ?? { section: "Procurement", page: "" };

  return (
    <div className="topbar">
      <div className="breadcrumb">
        Procurement <span>/</span> {crumb.section}
        {crumb.page && (
          <>
            {" "}
            <span>/</span> <strong>{crumb.page}</strong>
          </>
        )}
      </div>
      <input className="global-search" placeholder="Search anything…  (Ctrl+K)" />
      <div className="topbar-icons">
        <button className="icon-btn" title="Notifications">🔔</button>
        <button className="icon-btn" title="Help">?</button>
        <button className="icon-btn" title="Settings">⚙</button>
        <div className="avatar">AR</div>
        <span className="avatar-name">Alex Rivera</span>
      </div>
    </div>
  );
}
