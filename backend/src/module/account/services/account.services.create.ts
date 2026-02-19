import { pool } from "@/db/db.js";
import type { Account, AccountDTO } from "../types/account.types.js";
import type { RowDataPacket } from "mysql2/promise";

type OutIdRow = RowDataPacket & { idAccount: number };

export async function createAccountService(dto: AccountDTO): Promise<Account> {
  const conn = await pool.getConnection();
  try {
    await conn.query("SET @idAccount = 0");

    // IMPORTANTE: solo 4 params IN
    await conn.query("CALL sp_accounts_create(?,?,?,?,@idAccount)", [
      dto.name,
      dto.type,
      dto.currency,
      dto.balance,
    ]);

    const [idRows] = await conn.query<OutIdRow[]>(
      "SELECT @idAccount AS idAccount",
    );

    const idAccount = idRows[0]?.idAccount;
    if (!idAccount) throw new Error("Could not get idAccount");

    const [rows] = await conn.query<any[]>("CALL sp_accounts_get_by_id(?)", [
      idAccount,
    ]);

    const created = rows?.[0]?.[0];
    if (!created) throw new Error("Account created but not fetched");

    return created;
  } catch (error) {
    console.log("error en createAccountService", error);
    throw error;
  } finally {
    conn.release();
  }
}
