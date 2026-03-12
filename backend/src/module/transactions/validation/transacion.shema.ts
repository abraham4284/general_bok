import { z } from "zod";

export const createTransactionSchema = z.object({
  ocurred_at: z.string(),
  description: z.string().max(255),
  external_ref: z.string().max(255),
});

export const createTransactionLineSchema = z.object({
  idAccount: z.coerce.number().positive(),
  idAccountTo: z.coerce.number().positive().optional(),
  idGlCategorie: z.coerce.number().positive(),
  amount: z.coerce.number().positive(),
  direction: z.enum(["INCREMENT", "DECREMENT"]).optional(),
});