import { useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  createTransactionRequest,
  getTransactionsRequest,
} from "../api/transactions.api";
import type {
  GlTransactions,
  GlTransactionsCreate,
} from "../types/transactions.types";

type ActionResult<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

// Ajustá esto a tu ApiResponse real
// type ApiResponse<T> = {
//   status: "OK" | "ERROR" | string;
//   message: string;
//   data: T;
// };

// type ApiMessageResponse = {
//   status: "OK" | "ERROR" | string;
//   message: string;
// };

function getAxiosMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const axErr = err as AxiosError<any>;
    return (
      axErr.response?.data?.message || axErr.message || "Error desconocido"
    );
  }
  if (err instanceof Error) return err.message;
  return "Error desconocido";
}

export const useGltransactions = () => {
  const [transactions, setTransactions] = useState<GlTransactions[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getTransactions = useCallback(async (): Promise<
    ActionResult<GlTransactions[]>
  > => {
    try {
      setLoading(true);
      const { data } = await getTransactionsRequest();

      if (data.status === "OK") {
        setTransactions(data.data);
        setError(null);
        return { success: true, message: data.message, data: data.data };
      }

      setError(data.message || "Ocurrió un error inesperado");
      return { success: false, message: data.message || "Error" };
    } catch (err) {
      const message = getAxiosMessage(err);
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  const createGlTransaction = useCallback(
    async (
      payload: GlTransactionsCreate,
    ): Promise<ActionResult<GlTransactions>> => {
      try {
        setLoading(true);
        const { data } = await createTransactionRequest(payload); // ApiResponse<GlTransactions>
        console.log(data,'la que llega')

        if (data.status === "OK") {
          // si el backend devuelve la cuenta creada
          setTransactions((prev) => [...prev, data.data]);
          setError(null);
          return { success: true, message: data.message, data: data.data };
        }

        setError(data.message || "Ocurrió un error inesperado");
        return { success: false, message: data.message || "Error" };
      } catch (err) {
        const message = getAxiosMessage(err);
        setError(message);
        return { success: false, message };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const resetGlTransactions = useCallback(() => {
    setTransactions([]);
    setLoading(true);
    setError(null);
  }, []);

  return {
    transactions,
    loading,
    error,
    getTransactions,
    createGlTransaction,
    resetGlTransactions,
  };
};
