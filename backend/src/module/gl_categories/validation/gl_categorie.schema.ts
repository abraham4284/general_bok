import { z } from "zod";

export const createGlCategorySchema = z.object({
  name: z.string().min(1).max(80),
  nature: z.string().max(10),
  is_active: z.boolean(),
});

export const updateGlCategorieSchema = z.object({
  name: z.string().min(1).max(80),
  nature: z.string().max(10),
  is_active: z.boolean(),
});

export const idGlCategorieParamsSchema = z.object({
  idGlCategorie: z.coerce.number().int().positive(),
});
