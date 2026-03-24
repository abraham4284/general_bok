import { Request, Response } from "express";
import { transacionIdTransactions } from "../validation/transacion.shema.js";
import { cancelTransactionPutService } from "../services/transactions.service.put.js";

export async function cancelTransaction(req: Request, res: Response) {
  try {
    const { id } = transacionIdTransactions.parse(req.params);
    const { status, message, success, data } =
      await cancelTransactionPutService(id);
    if (status === "ERROR") {
      return res.status(404).json({
        status: "ERROR",
        success: false,
        message: "Error al cancelar la transaccion",
        data: [],
      });
    }
    return res.status(200).json({
      status,
      success,
      message,
      data,
    });
  } catch (error) {
    console.log(error, "error en cancelTransaction controller");
    return res.status(500).json({
      status: "ERROR",
      message: "Error interno del servidor",
      error: error,
    });
  }
}
