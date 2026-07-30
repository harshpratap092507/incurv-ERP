import { NavLink } from "react-router-dom";

const NAV = [
  { label: "Dashboard", icon: "▦" },
  {
    label: "Procurement",
    icon: "🛒",
    active: true,
    children: [
      { label: "Requisitions", to: "/" },
      { label: "Purchase Orders", to: "/newPurchase" },
      { label: "Goods Receipts", to: null },
      { label: "Vendors", to: null },
    ],
  },
  { label: "Inventory", icon: "📦" },
  { label: "Finance", icon: "₹" },
  { label: "Reports", icon: "📊" },
];

export function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-mark">◆</span>
        <div>
          <div className="logo-name">Incurv ERP</div>
          <div className="logo-sub">ENTERPRISE CENTRAL</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV.map((item) => (
          <div key={item.label}>
            <div className={`nav-item ${item.active ? "nav-item-active" : ""}`}>
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </div>
            {item.children && (
              <div className="nav-children">
                {item.children.map((child) =>
                  child.to ? (
                    <NavLink
                      key={child.label}
                      to={child.to}
                      end={child.to === "/"}
                      className={({ isActive }) =>
                        `nav-child ${isActive ? "nav-child-active" : ""}`
                      }
                    >
                      {child.label}
                    </NavLink>
                  ) : (
                    <div key={child.label} className="nav-child nav-child-disabled">
                      {child.label}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="nav-item">
          <span className="nav-icon">🎧</span>Support
        </div>
        <div className="nav-item">
          <span className="nav-icon">↩</span>Sign Out
        </div>
      </div>
    </aside>
  );
}
