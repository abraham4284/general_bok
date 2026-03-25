import { pool } from "@/db/db.js";
import type { Request, Response } from "express"

export async function getTransactionTruncate(_: Request, res: Response) {
  try {
    const conn = await pool.getConnection();
    await conn.beginTransaction();
    await conn.query("SET FOREIGN_KEY_CHECKS = 0");
    await conn.query("TRUNCATE TABLE gl_transaction_lines");
    await conn.query("TRUNCATE TABLE gl_transactions");
    await conn.query("SET FOREIGN_KEY_CHECKS = 1");

    await conn.commit();
    conn.release();
    return res.status(200).json({
      status: "OK",
      message: "Tablas truncadas correctamente",
    });
  } catch (error) {
    console.log(error, "error en getGlCategories controller");
    return res.status(500).json({
      status: "ERROR",
      message: "Error interno del servidor",
      error: error,
    });
  }
}
