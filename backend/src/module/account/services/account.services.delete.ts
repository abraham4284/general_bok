import { pool } from "@/db/db.js";
import type { ResultSetHeader } from "mysql2/promise";

export async function deleteAccountService(
  idAccount: number,
): Promise<Boolean> {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query<ResultSetHeader>(
      "CALL sp_accounts_delete(?);",
      [idAccount],
    );
    if (result.affectedRows < 0) {
      throw new Error(`Error al eliminar la cuenta con el id ${idAccount}`);
    }
    return true;
  } catch (error) {
    console.log("Error en deleteTaskService", error);
    throw error;
  } finally {
    conn.release();
  }
}
