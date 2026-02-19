import { Router } from "express";
import { createGlCategorie, deleteGlCategorie, getGlCategories, updateGlCategorie } from "../controllers/index.js";
import { requireAuth } from "@/middleware/requireAuth.js";

const router = Router();

router.get("/glcategorie", requireAuth, getGlCategories);
router.post("/glcategorie", requireAuth, createGlCategorie);
router.put("/glcategorie/:idGlCategorie", requireAuth, updateGlCategorie);
router.delete("/glcategorie/:idGlCategorie", requireAuth, deleteGlCategorie);

export default router;
