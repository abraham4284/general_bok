import { Router } from "express";
import { createTransaction } from "../controllers/index.js";
import { requireAuth } from "@/middleware/requireAuth.js";

const router = Router();

router.post("/transaction", requireAuth, createTransaction);

export default router;
