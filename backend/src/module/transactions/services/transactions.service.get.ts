import { pool } from "@/db/db.js";
import type { GlTransaction } from "../types/transaction.types.js";

export async function getTransactionsServices(): Promise<GlTransaction[] | undefined> {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<any[]>(
      "CALL sp_gl_transactions_getAll()",
    );
    const rows = result?.[0] ?? [];
    return rows;
  } catch (error) {
    console.log("Error en getTransactionsServices", error);
  } finally {
    conn.release();
  }
}


export async function getTIdransactionsServices(id: number): Promise<GlTransaction[] | undefined> {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<any[]>(
      "CALL sp_gl_transactions_get_by_id(?)",[id]
    );
    const rows = result?.[0] ?? [];
    return rows;
  } catch (error) {
    console.log("Error en getTransactionsServices", error);
  } finally {
    conn.release();
  }
}