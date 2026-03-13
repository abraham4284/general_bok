import { Routes, Route } from "react-router-dom";
import { TransactionPage,TransactionLineByIdPage } from "../page";

export const TransactionRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<TransactionPage />} />
      <Route path="/:id" element={<TransactionLineByIdPage />} />
    </Routes>
  );
};
