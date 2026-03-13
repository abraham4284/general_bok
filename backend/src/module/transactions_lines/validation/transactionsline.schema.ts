import { z } from "zod";

export const transacionLineIdTransactions = z.object({
  id: z.coerce.number().int().positive(),
});