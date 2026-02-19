import type { Request, Response } from "express";
import { idGlCategorieParamsSchema } from "../validation/gl_categorie.schema.js";
import { deleteGlCategorieService } from "../services/gl_categories.services.delete.js";

export async function deleteGlCategorie(req: Request, res: Response) {
  try {
    const { idGlCategorie } = idGlCategorieParamsSchema.parse(req.params);
    const deleted = await deleteGlCategorieService(idGlCategorie);

    if (!deleted) {
      return res.status(404).json({
        status: "ERROR",
        message: `GlCategorie with id ${idGlCategorie} not found`,
      });
    }

    return res.status(200).json({
      status: "OK",
      message: "GlCategorie deleted successfully",
    });
  } catch (error) {
    console.log(error, "error en deleteGlCategorie controller");
    return res.status(500).json({
      status: "ERROR",
      message: "Error interno del servidor",
      error: error,
    });
  }
}
