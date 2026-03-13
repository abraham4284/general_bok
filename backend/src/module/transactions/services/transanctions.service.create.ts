import { pool } from "@/db/db.js";
import {
  TransactionDTO,
  TransactionLineDTO,
} from "../types/transaction.types.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import { createTransactionLineHelper } from "../helpers/transaction_line_helper.create.js";

type OutIdRow = RowDataPacket & { idGlTransaction: number };

type ResponseTransactionService = {
  status: string;
  success: boolean;
  message: string;
  data?: TransactionDTO | [];
};

export async function createTransactionService(
  dto: TransactionDTO,
  dtoLine: TransactionLineDTO,
): Promise<ResponseTransactionService> {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  try {
    await conn.query("SET @idGltransaction = 0");
    const [result] = await conn.query<ResultSetHeader>(
      "CALL sp_gl_transactions_create(?,?,?,?,?,@idGlTransaction)",
      [dto.ocurred_at, dto.description, "OK", "MANUAL", dto.external_ref],
    );
    if (result.affectedRows === 0) {
      await conn.rollback();
      return {
        status: "error",
        success: false,
        message: "Failed to create transaction",
        data: [],
      };
    }

    const [idRows] = await conn.query<OutIdRow[]>(
      "SELECT @idGlTransaction AS idGlTransaction",
    );

    const idGlTransaction = idRows[0]?.idGlTransaction;
    if (!idGlTransaction) throw new Error("Could not get idGlTransaction");

    const [rows] = await conn.query<any[]>(
      "CALL sp_gl_transactions_get_by_id(?)",
      [idGlTransaction],
    );

    const created = rows?.[0]?.[0];
    if (!created) throw new Error("Transaction created but not fetched");

    // Creamos las transacciones en linea

    const { status, message } = await createTransactionLineHelper(
      {
        amount: dtoLine.amount,
        note: dto.description,
        idGlTransaction,
        idGlCategorie: dtoLine.idGlCategorie,
        idAccount: dtoLine.idAccount,
        idAccountTo: dtoLine.idAccountTo,
        idUser: dtoLine.idUser,
        direction: dtoLine.direction,
      },
      conn,
    );

    if (status === "error") {
      await conn.rollback();
      return {
        status: "error",
        success: false,
        message,
        data: [],
      };
    }

    await conn.commit();
    conn.release();
    return {
      status: "OK",
      success: true,
      message: "Transaction created successfully",
      data: created,
    };
  } catch (error) {
    console.log("error en createTransactionService", error);
    throw error;
  } finally {
    conn.release();
  }
}
