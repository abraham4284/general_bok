import { createPool } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const pool = createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Test de conexión inicial
(async (): Promise<void> => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ DB conectada correctamente a MySQL");
    connection.release();
  } catch (error) {
    if (error instanceof Error) {
      console.error("❌ Error de conexión:", error.message);
    } else {
      console.error("❌ Error de conexión desconocido:", error);
    }
  }
})();
