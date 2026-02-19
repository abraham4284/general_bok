import { pool } from "@/db/db.js";
import type {
  GlCategoryDTO,
  GlCategory,
} from "../types/gl_categories.types.js";
import type { RowDataPacket } from "mysql2/promise";

type OutIdRow = RowDataPacket & { idGlCategorie: number };

export async function createGlCategoryService(
  dto: GlCategoryDTO,
): Promise<GlCategory> {
  const conn = await pool.getConnection();
  try {
    await conn.query("SET @idGlCategorie = 0");

    // IMPORTANTE: solo 4 params IN
    await conn.query("CALL sp_gl_categories_create(?,?,?,@idGlCategorie)", [
      dto.name,
      dto.nature,
      dto.is_active,
    ]);

    const [idRows] = await conn.query<OutIdRow[]>(
      "SELECT @idGlCategorie AS idGlCategorie",
    );

    const idGlCategorie = idRows[0]?.idGlCategorie;
    if (!idGlCategorie) throw new Error("Could not get idGlCategorie");

    const [rows] = await conn.query<any[]>(
      "CALL sp_gl_categories_get_by_id(?)",
      [idGlCategorie],
    );

    const created = rows?.[0]?.[0];
    if (!created) throw new Error("GlCategory created but not fetched");

    return created;
  } catch (error) {
    console.log("error en createGlCategoryService", error);
    throw error;
  } finally {
    conn.release();
  }
}
