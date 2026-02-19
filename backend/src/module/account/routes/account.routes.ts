import { Router } from "express";
import {
  createAccount,
  updateAccount,
  deleteAccount,
  getAccounts
} from "../controllers/index.js";
import { requireAuth } from "@/middleware/requireAuth.js";

const router = Router();

router.get("/account", requireAuth, getAccounts);
router.post("/account", requireAuth, createAccount);
router.put("/account/:idAccount", requireAuth, updateAccount);
router.delete("/account/:idAccount", requireAuth, deleteAccount);

export default router;
