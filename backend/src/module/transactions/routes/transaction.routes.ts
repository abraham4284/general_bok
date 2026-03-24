import { Router } from "express";
import {
  createTransaction,
  getTransactions,
  getIdTransactions,
  cancelTransaction,
} from "../controllers/index.js";
import { requireAuth } from "@/middleware/requireAuth.js";

const router = Router();

router.get("/transaction", requireAuth, getTransactions);
router.get("/transaction/:id", requireAuth, getIdTransactions);
router.post("/transaction", requireAuth, createTransaction);
router.put("/transaction/:id", requireAuth, cancelTransaction);

export default router;
