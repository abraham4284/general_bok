import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "@/routes/AppRoutes";

export const GeneralBookApp = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
