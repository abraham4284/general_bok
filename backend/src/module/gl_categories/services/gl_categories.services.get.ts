import { pool } from "@/db/db.js";
import type { GlCategory } from "../types/gl_categories.types.js";

export async function getGlCategoriesService(): Promise<
  GlCategory[] | undefined
> {
  const conn = await pool.getConnection();

  try {
    const [result] = await pool.query<any[]>("CALL sp_gl_categories_list()");
    const rows = result?.[0] ?? [];
    return rows;
  } catch (error) {
    console.log("Error en getGlCategoriesService", error);
  } finally {
    conn.release();
  }
}
