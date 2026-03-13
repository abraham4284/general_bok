import { Router } from "express";
import {getTransactionsLineById } from "../controllers/index.js";
import { requireAuth } from "@/middleware/requireAuth.js";

const router = Router();

router.get("/transactionLine/:id", requireAuth, getTransactionsLineById);

export default router;
