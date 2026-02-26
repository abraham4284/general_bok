import { Routes, Route } from "react-router-dom";
import { HomeRoutes } from "@/views/home";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/*" element={<HomeRoutes />} />
    </Routes>
  );
};
