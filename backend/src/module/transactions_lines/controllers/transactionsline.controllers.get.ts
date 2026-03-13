import type { Request, Response } from "express";
import { getTransactionsLineServices } from "../services/index.js";
import { transacionLineIdTransactions } from "../validation/transactionsline.schema.js";
export async function getTransactionsLineById(req: Request, res: Response) {
  try {
    const { id } = transacionLineIdTransactions.parse(req.params);
   
    const transactionsLine = await getTransactionsLineServices(id);
    return res.status(200).json({
      status: "OK",
      message: "Transactions retrieved successfully",
      data: transactionsLine,
    });
  } catch (error) {
    console.log(error, "error en getTransactionsLine controller");
    return res.status(500).json({
      status: "ERROR",
      message: "Error interno del servidor",
      error: error,
    });
  }
}
