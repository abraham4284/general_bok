import { pool } from "@/db/db.js";
import { Decimal } from "decimal.js";
import { updateBalanceHelper } from "../helpers/updateAccountBalance.js";

type ResponseTransactionService = {
  status: string;
  success: boolean;
  message: string;
  data?: any[] | object;
};

export async function cancelTransactionPutService(
  id: number,
): Promise<ResponseTransactionService> {
  const conn = await pool.getConnection();
  await conn.beginTransaction();

  try {
    // 1) Obtener transacción
    const [resultGetTransaction] = await conn.query<any[]>(
      "CALL sp_gl_transactions_get_by_id(?)",
      [id],
    );

    const transaction = resultGetTransaction?.[0]?.[0];

    if (!transaction) {
      await conn.rollback();
      return {
        status: "ERROR",
        success: false,
        message: "No existe la transacción",
        data: [],
      };
    }

    if (transaction.status === "ANULADO" || transaction.status === "VOID") {
      await conn.rollback();
      return {
        status: "ERROR",
        success: false,
        message: "La transacción ya fue anulada",
        data: [],
      };
    }

    // 2) Obtener líneas por idGltransaction
    const [resultGetTransactionsLine] = await conn.query<any[]>(
      "CALL sp_gl_transaction_lines_get_by_transaction_id(?)",
      [id],
    );

    const lines = resultGetTransactionsLine?.[0] ?? [];

    if (lines.length === 0) {
      await conn.rollback();
      return {
        status: "ERROR",
        success: false,
        message: "No existen líneas para esta transacción",
        data: [],
      };
    }

    // 3) Revertir líneas
    for (const line of lines) {
      const amountDecimal = new Decimal(line.amount).abs();
      const nature = line.nature;
      const idAccount = line.idAccount;
      const idAccountTo = line.idAccountTo ?? null;

      if (nature === "INCOME") {
        // reversa: restar lo que se había sumado
        const result = await updateBalanceHelper(
          {
            idAccountFrom: idAccount,
            amount: amountDecimal,
            nature: "ADJUSTMENT",
            direction: "DECREMENT",
          },
          conn,
        );

        if (!result.success) {
          await conn.rollback();
          return {
            status: "ERROR",
            success: false,
            message: result.message,
            data: [],
          };
        }
      } else if (nature === "EXPENSE") {
        // reversa: sumar lo que se había restado
        const result = await updateBalanceHelper(
          {
            idAccountFrom: idAccount,
            amount: amountDecimal,
            nature: "ADJUSTMENT",
            direction: "INCREMENT",
          },
          conn,
        );

        if (!result.success) {
          await conn.rollback();
          return {
            status: "ERROR",
            success: false,
            message: result.message,
            data: [],
          };
        }
      } else if (nature === "ADJUSTMENT") {
        const originalAmount = new Decimal(line.amount);

        const reverseDirection = originalAmount.isNegative()
          ? "INCREMENT"
          : "DECREMENT";

        const result = await updateBalanceHelper(
          {
            idAccountFrom: idAccount,
            amount: originalAmount.abs(),
            nature: "ADJUSTMENT",
            direction: reverseDirection,
          },
          conn,
        );

        if (!result.success) {
          await conn.rollback();
          return {
            status: "ERROR",
            success: false,
            message: result.message,
            data: [],
          };
        }
      } else if (nature === "TRANSFER") {
        if (!idAccountTo) {
          await conn.rollback();
          return {
            status: "ERROR",
            success: false,
            message: "La transferencia no tiene cuenta destino registrada",
            data: [],
          };
        }

        // reversa: transferencia inversa
        const result = await updateBalanceHelper(
          {
            idAccountFrom: idAccountTo,
            idAccountTo: idAccount,
            amount: amountDecimal,
            nature: "TRANSFER",
          },
          conn,
        );

        if (!result.success) {
          await conn.rollback();
          return {
            status: "ERROR",
            success: false,
            message: result.message,
            data: [],
          };
        }
      } else if (nature === "OTHER") {
        // lo trato como ajuste
        const originalAmount = new Decimal(line.amount);

        const reverseDirection = originalAmount.isNegative()
          ? "INCREMENT"
          : "DECREMENT";

        const result = await updateBalanceHelper(
          {
            idAccountFrom: idAccount,
            amount: originalAmount.abs(),
            nature: "ADJUSTMENT",
            direction: reverseDirection,
          },
          conn,
        );

        if (!result.success) {
          await conn.rollback();
          return {
            status: "ERROR",
            success: false,
            message: result.message,
            data: [],
          };
        }
      }
    }

    // 4) Marcar transacción como anulada
    await conn.query(
      "UPDATE gl_transactions SET status = ? WHERE idGltransaction = ?",
      ["ANULADO", id],
    );

    // 5) Llamamos a la transaction actualizada y la mandamos

    const [ resultTransactionUpdate ] = await conn.query<any[]>("CALL sp_gl_transactions_get_by_id(?)",[id]);
    await conn.commit();

    return {
      status: "OK",
      success: true,
      message: "Transacción anulada correctamente",
      data: resultTransactionUpdate ? resultTransactionUpdate[0] : [],
    };
  } catch (error) {
    await conn.rollback();
    console.log("error en cancelTransactionPutService", error);
    throw error;
  } finally {
    conn.release();
  }
}
