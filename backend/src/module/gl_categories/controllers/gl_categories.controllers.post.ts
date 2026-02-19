import { createGlCategorySchema } from "../validation/gl_categorie.schema.js";
import type { Request, Response } from "express";
import { createGlCategoryService } from "../services/index.js"

export async function createGlCategorie(req: Request, res: Response) {
  try {
    const dto = createGlCategorySchema.parse(req.body);
    const created = await createGlCategoryService(dto);
    return res.status(201).json({
      status: "OK",
      message: "Task created successfully",
      data: created,
    });
  } catch (error) {
    console.log(error, "error en createAccount controller");
    return res.status(500).json({
      status: "ERROR",
      message: "Error interno del servidor",
      error: error,
    });
  }
}
