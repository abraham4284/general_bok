import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(1).max(80),
  type: z.string().max(10),
  currency: z.string().max(3),
  balance: z.coerce.number(),
});

export const updateAccountTaskSchema = z.object({
  name: z.string().min(1).max(80),
  type: z.string().max(10),
  currency: z.string().max(3),
  balance: z.coerce.number(),
  is_active: z.preprocess((value) => {
    if (value === "1" || value === 1 || value === true) return true;
    if (value === "0" || value === 0 || value === false) return false;
    return value;
  }, z.boolean()),
});

export const idAccountParamsSchema = z.object({
  idAccount: z.coerce.number().int().positive(),
});
