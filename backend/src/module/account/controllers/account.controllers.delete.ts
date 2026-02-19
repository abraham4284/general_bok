import type { Request, Response } from "express";
import { idAccountParamsSchema } from "../validation/account.shema.js";
import { deleteAccountService } from "../services/account.services.delete.js";

export async function deleteAccount(req: Request, res: Response) {
  try {
    const { idAccount } = idAccountParamsSchema.parse(req.params);
    const deleted = await deleteAccountService(idAccount);

    if (!deleted) {
      return res.status(404).json({
        status: "ERROR",
        message: `Account with id ${idAccount} not found`,
      });
    }

    return res.status(200).json({
      status: "OK",
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.log(error, "error en deleteAccount controller");
    return res.status(500).json({
      status: "ERROR",
      message: "Error interno del servidor",
      error: error,
    });
  }
}
