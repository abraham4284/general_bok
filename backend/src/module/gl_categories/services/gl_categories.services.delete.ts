import { pool } from "@/db/db.js";
import type { ResultSetHeader } from "mysql2/promise";

export async function deleteGlCategorieService(
  idGlCategorie: number,
): Promise<Boolean> {
  const conn = await pool.getConnection();
  try {
    const [result] = await conn.query<ResultSetHeader>(
      "CALL sp_gl_categories_delete(?);",
      [idGlCategorie],
    );
    if (result.affectedRows < 0) {
      throw new Error(`Error al eliminar la categoria con el id ${idGlCategorie}`);
    }
    return true;
  } catch (error) {
    console.log("Error en deleteGlCategorieService", error);
    throw error;
  } finally {
    conn.release();
  }
}