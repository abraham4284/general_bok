import { Router } from "express";
import { createTransaction, getTransactions } from "../controllers/index.js";
import { requireAuth } from "@/middleware/requireAuth.js";

const router = Router();

router.get("/transaction", requireAuth, getTransactions);
router.post("/transaction", requireAuth, createTransaction);

export default router;
