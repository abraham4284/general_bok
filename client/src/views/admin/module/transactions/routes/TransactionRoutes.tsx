import { Routes, Route } from "react-router-dom";
import { TransactionPage } from "../page/TransactionPage";

export const TransactionRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TransactionPage />} />
    </Routes>
  );
};
