import type { Request, Response } from "express";
import { getGlCategoriesService } from "../services/gl_categories.services.get.js";

export async function getGlCategories(_: Request, res: Response) {
  try {
    const glCategories = await getGlCategoriesService();
    return res.status(200).json({
      status: "OK",
      message: "GlCategories retrieved successfully",
      data: glCategories,
    });
  } catch (error) {
    console.log(error, "error en getGlCategories controller");
    return res.status(500).json({
      status: "ERROR",
      message: "Error interno del servidor",
      error: error,
    });
  }
}
