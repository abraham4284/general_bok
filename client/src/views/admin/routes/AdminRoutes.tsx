import { Route, Routes } from "react-router-dom";
import { AccountRoutes } from "@/views/admin/module";

export const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/account/*" element={<AccountRoutes />} />
    </Routes>
  );
};
