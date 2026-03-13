import { pool } from "@/db/db.js";
import type { GlTransactionsLine } from "../types/trasactionsline.type.js";

export async function getTransactionsLineServices(id:number): Promise<GlTransactionsLine[] | undefined> {
  const conn = await pool.getConnection();
  try {
    const [result] = await pool.query<any[]>(
      "CALL sp_gl_transaction_lines_get_by_id(?)",[id]
    );
    const rows = result?.[0] ?? [];
    return rows;
  } catch (error) {
    console.log("Error en getTransactionsServices", error);
  } finally {
    conn.release();
  }
}
