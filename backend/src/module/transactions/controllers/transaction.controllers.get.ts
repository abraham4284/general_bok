import type { Request, Response } from "express";
import { getTransactionsServices } from "../services/index.js";
export async function getTransactions(req: Request, res: Response) {
  try {
    const transactions = await getTransactionsServices();
    return res.status(200).json({
      status: "OK",
      message: "Transactions retrieved successfully",
      data: transactions,
    });
  } catch (error) {
    console.log(error, "error en getTransactions controller");
    return res.status(500).json({
      status: "ERROR",
      message: "Error interno del servidor",
      error: error,
    });
  }
}
