import { Router } from "express";
import {
  getTransactionTruncate
} from "../controllers/index.js";
import { requireAuth } from "@/middleware/requireAuth.js";

const router = Router();

router.get("/transaction-truncate", requireAuth, getTransactionTruncate);


export default router;
