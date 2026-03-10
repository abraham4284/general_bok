import { createAccountService } from "@module/account/services/index.js";
import { createAccountSchema } from "@module/account/validation/account.shema.js";
import type { Request, Response } from "express";

export async function createAccount(req: Request, res: Response) {
  try {
    const dto = createAccountSchema.parse(req.body);
    const created = await createAccountService(dto);
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
