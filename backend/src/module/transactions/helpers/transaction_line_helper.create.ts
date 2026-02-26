import { Decimal } from "decimal.js";
import { ResultSetHeader } from "mysql2/promise";
import { updateBalanceHelper } from "../helpers/index.js";

type dtoTransactionLine = {
  amount: number;
  note: string;
  idGlTransaction: number;
  idGlCategorie: number;
  idAccount: number;
  idAccountTo?: number;
  idUser: number;
  direction?: "INCREMENT" | "DECREMENT" | string;
};

type ResponseTransactionLine = {
  status: string;
  success: boolean;
  message: string;
};

export async function createTransactionLineHelper(
  dto: dtoTransactionLine,
  conn: any | ResultSetHeader,
): Promise<ResponseTransactionLine> {
  try {
    const amountDecimal = new Decimal(dto.amount);
    const [glCategorie] = await conn.query(
      "CALL sp_gl_categories_get_by_id(?)",
      [dto.idGlCategorie],
    );
    if (!glCategorie?.[0]?.[0]) throw new Error("GlCategorie not found");
    const { nature } = glCategorie[0][0];

    if (nature === "TRANSFER") {
      const [resultTransferAccountFrom] = await conn.query(
        "CALL sp_gl_transaction_lines_create(?,?,?,?,?)",
        [
          dto.idGlTransaction,
          dto.idAccount,
          dto.idGlCategorie,
          dto.amount,
          dto.note,
        ],
      );
      if (resultTransferAccountFrom.affectedRows === 0) {
        return {
          status: "error",
          success: false,
          message: "Failed to create transaction line",
        };
      }

      const [resultTransferAccountTo] = await conn.query(
        "CALL sp_gl_transaction_lines_create(?,?,?,?,?)",
        [
          dto.idGlTransaction,
          dto.idAccountTo,
          dto.idGlCategorie,
          dto.amount,
          dto.note,
        ],
      );
      if (resultTransferAccountTo.affectedRows === 0) {
        return {
          status: "error",
          success: false,
          message: "Error al crear la línea de transacción para la cuenta destino",
        };
      }
      const { status, message } = await updateBalanceHelper(
        {
          idAccountFrom: dto.idAccount,
          idAccountTo: dto.idAccountTo,
          amount: amountDecimal,
          nature: nature,
        },
        conn,
      );
      if (status === "error") {
        return {
          status: "error",
          success: false,
          message: `Error al actualizar el saldo de la cuenta: ${message}`,
        };
      }
      return {
        status: "success",
        success: true,
        message:
          "Transaction line created and account balance updated successfully",
      };
    } else {
      const [result] = await conn.query(
        "CALL sp_gl_transaction_lines_create(?,?,?,?,?)",
        [
          dto.idGlTransaction,
          dto.idAccount,
          dto.idGlCategorie,
          dto.amount,
          dto.note,
        ],
      );
      if (result.affectedRows === 0) {
        return {
          status: "error",
          success: false,
          message: "Failed to create transaction line",
        };
      }
      const { status, message } = await updateBalanceHelper(
        {
          idAccountFrom: dto.idAccount,
          amount: amountDecimal,
          nature: nature,
          direction: dto.direction,
        },
        conn,
      );
      if (status === "error") {
        return {
          status: "error",
          success: false,
          message: `Error al actualizar el saldo de la cuenta: ${message}`,
        };
      }
      return {
        status: "success",
        success: true,
        message:
          "Transaction line created and account balance updated successfully",
      };
    }
  } catch (error) {
    console.log("error en createTransactionLineHelper", error);
    throw error;
  } finally {
    conn.release();
  }
}
