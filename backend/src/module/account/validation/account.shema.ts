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
  is_active: z.boolean(),
});

export const idAccountParamsSchema = z.object({
  idAccount: z.coerce.number().int().positive(),
});
