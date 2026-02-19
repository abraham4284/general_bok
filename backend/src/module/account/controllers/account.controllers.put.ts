import type { Request, Response } from "express";
import {
  idAccountParamsSchema,
  updateAccountTaskSchema,
} from "@module/account/validation/account.shema.js";
import { updateAccountService } from "../services/account.services.update.js";

export async function updateAccount(req: Request, res: Response) {
  try {
    const { idAccount } = idAccountParamsSchema.parse(req.params);
    const dto = updateAccountTaskSchema.parse(req.body);
    const updated = await updateAccountService(idAccount, dto);
    if (!updated) {
      return res.status(404).json({
        status: "ERROR",
        message: `Account with id ${idAccount} not found`,
      });
    }

    return res.status(200).json({
      status: "OK",
      message: "Account updated successfully",
      data: updated,
    });
  } catch (error) {
    console.log(error, "error en updateAccount controller");
    return res.status(500).json({
      status: "ERROR",
      message: "Error interno del servidor",
      error: error,
    });
  }
}
