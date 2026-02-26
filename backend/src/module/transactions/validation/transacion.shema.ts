import { z } from "zod";

export const createTransactionSchema = z.object({
  ocurred_at: z.string(),
  description: z.string().max(255),
  external_ref: z.string().max(255),
});


export const createTransactionLineSchema = z.object({
  idAccount: z.number().positive(),
  idAccountTo: z.number().positive().optional(),
  idGlCategorie: z.number().positive(),
  amount: z.number().positive(),
  direction: z.enum(["INCREMENT", "DECREMENT"]).optional(),
});
