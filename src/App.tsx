import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layout/AppLayout";
import { BulkRequisitionPage } from "./pages/BulkRequisitionPage";
import { NewPurchaseOrderPage } from "./pages/NewPurchaseOrderPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<BulkRequisitionPage />} />
          <Route path="/newPurchase" element={<NewPurchaseOrderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
