import type { Request, Response } from "express";
import {
  idGlCategorieParamsSchema,
  updateGlCategorieSchema,
} from "../validation/gl_categorie.schema.js";
import { updateGlCategorieService } from "../services/gl_categories.services.update.js";

export async function updateGlCategorie(req: Request, res: Response) {
  try {
    const { idGlCategorie } = idGlCategorieParamsSchema.parse(req.params);
    const dto = updateGlCategorieSchema.parse(req.body);
    const updated = await updateGlCategorieService(idGlCategorie, dto);
    if (!updated) {
      return res.status(404).json({
        status: "ERROR",
        message: `GlCategorie with id ${idGlCategorie} not found`,
      });
    }

    return res.status(200).json({
      status: "OK",
      message: "GlCategorie updated successfully",
      data: updated,
    });
  } catch (error) {
    console.log(error, "error en updateGlCategorie controller");
    return res.status(500).json({
      status: "ERROR",
      message: "Error interno del servidor",
      error: error,
    });
  }
}
