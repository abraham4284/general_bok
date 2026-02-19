import { pool } from "@/db/db.js";
import type { Account } from "../types/account.types.js";

export async function getAccountService(): Promise<Account[] | undefined> {
  const conn = await pool.getConnection();

  try {
    const [result] = await pool.query<any[]>("CALL sp_accounts_getAll()");
    const rows = result?.[0] ?? [];
    return rows;
  } catch (error) {
    console.log("Error en getAccountService", error);
  } finally {
    conn.release();
  }
}
