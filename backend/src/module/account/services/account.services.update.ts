import { pool } from "@/db/db.js";
import type { Account, AccountUpdate } from "../types/account.types.js";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

type AccountRow = RowDataPacket & Account;

export async function updateAccountService(
  idAccount: number,
  dto: AccountUpdate,
): Promise<Account | null> {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<ResultSetHeader>(
      "CALL sp_accounts_update(?,?,?,?,?,?)",
      [idAccount, dto.name, dto.type, dto.currency, dto.balance, dto.is_active],
    );
    if (result.affectedRows < 0) {
      throw new Error("No se pudo actualizar la cuenta");
    }
    const [updated] = await pool.query<any[]>("CALL sp_accounts_get_by_id(?)", [
      idAccount,
    ]);
    const row = updated?.[0]?.[0];

    return row;
  } catch (error) {
    console.log("error en updateAccountService", error);
    throw error;
  } finally {
    conn.release();
  }
}
