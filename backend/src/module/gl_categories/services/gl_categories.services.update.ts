import { pool } from "@/db/db.js";
import type {
  GlCategory,
  GlCategoryUpdate,
} from "../types/gl_categories.types.js";
import type { ResultSetHeader } from "mysql2/promise";

export async function updateGlCategorieService(
  idGlCategorie: number,
  dto: GlCategoryUpdate,
): Promise<GlCategory | null> {
  const conn = await pool.getConnection();
  try {
    try {
      const [result] = await conn.query<ResultSetHeader>(
        "CALL sp_gl_categories_update(?,?,?,?)",
        [idGlCategorie, dto.name, dto.nature, dto.is_active],
      );
      if (result.affectedRows === 0) {
        return null;
      }
      const [rows] = await conn.query<any[]>(
        "CALL sp_gl_categories_get_by_id(?)",
        [idGlCategorie],
      );
      return rows[0]?.[0] || null;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error in updateGlCategorieService:", error);
    throw error;
  } finally {
    conn.release();
  }
}
