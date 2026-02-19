import type { Request, Response } from "express";
import { getAccountService } from "../services/account.services.get.js";

export async function getAccounts(req: Request, res: Response) {
  try {
    const accounts = await getAccountService();
    return res.status(200).json({
      status: "OK",
      message: "Account retrieved successfully",
      data: accounts,
    });
  } catch (error) {
    console.log(error, "error en getAccounts controller");
    return res.status(500).json({
      status: "ERROR",
      message: "Error interno del servidor",
      error: error,
    });
  }
}
