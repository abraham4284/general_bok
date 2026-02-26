import { Request, Response } from "express";
import {
  createTransactionSchema,
  createTransactionLineSchema,
} from "../validation/transacion.shema.js";
import { createTransactionService } from "../services/transanctions.service.create.js";

export async function createTransaction(req: Request, res: Response) {
  try {
    const dtoTransaction = createTransactionSchema.parse(req.body);
    const dtoTransactionLine = createTransactionLineSchema.parse(req.body);
    const user = req.user;
    if (!user?.idUser) {
      return res.status(401).json({
        status: "ERROR",
        message: "No autenticado",
      });
    }
    const { idAccount, idAccountTo, idGlCategorie, amount, direction } =
      dtoTransactionLine;
    const { status, message, data } = await createTransactionService(
      dtoTransaction,
      {
        idAccount,
        idAccountTo,
        idGlCategorie,
        idUser: user.idUser,
        amount,
        direction,
      },
    );
    if (!status || !message) {
      return {
        status: "ERROR",
        message: "Error al crear la transacción",
      };
    }
    return res.status(201).json({
      status,
      message,
      data,
    });
  } catch (error) {
    console.log(error, "error en createTransaction controller");
    return res.status(500).json({
      status: "ERROR",
      message: "Error interno del servidor",
      error: error,
    });
  }
}
