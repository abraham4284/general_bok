import { Decimal } from "decimal.js";

type UpdateBalance = {
  idAccountFrom?: number;
  idAccountTo?: number | null;
  amount: number | Decimal;
  nature: "INCOME" | "EXPENSE" | "ADJUSTMENT" | "TRANSFER" | "OTHER" | string;
  direction?: string;
};

type UpdateBalanceResponse = {
  status: string;
  success: boolean;
  message: string;
};

export async function updateBalanceHelper(
  dto: UpdateBalance,
  conn: any,
): Promise<UpdateBalanceResponse> {
  try {
    if (!dto.idAccountFrom || !dto.amount)
      throw new Error("idAccount and amount are required");
    const amountDecimal = new Decimal(dto.amount);
    const [accountById] = await conn.query("CALL sp_accounts_get_by_id(?)", [
      dto.idAccountFrom,
    ]);
    if (!accountById?.[0]?.[0]) throw new Error("Account not found");
    const currentBalance = new Decimal(accountById[0][0].balance);
    const amountDirection =
      dto.direction === "INCREMENT" ? amountDecimal : amountDecimal.toString();

    if (
      dto.nature === "EXPENSE" ||
      dto.nature === "TRANSFER" ||
      dto.nature === "ADJUSTMENT"
    ) {
      if (amountDecimal.gt(currentBalance)) {
        return {
          status: "error",
          success: false,
          message: "Insufficient balance for this transaction",
        };
      }
    }
    const [result] = await conn.query(
      "CALL sp_accounts_apply_by_nature(?,?,?,?)",
      [dto.idAccountFrom, amountDirection, dto.nature, dto.idAccountTo || null],
    );

    if (result.affectedRows === 0) {
      return {
        status: "error",
        success: false,
        message: "Failed to update account balance",
      };
    }

    return {
      status: "success",
      success: true,
      message: "Account balance updated successfully",
    };
  } catch (error) {
    console.log("Error en updateBalanceHelper", error);
    throw error;
  }
}
