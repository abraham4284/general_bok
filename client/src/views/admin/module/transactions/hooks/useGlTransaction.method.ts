import { useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  createTransactionRequest,
  getTransactionsRequest,
  getTransactionsLineRequest,
  getIdTransactionsRequest,
} from "../api/transactions.api";
import type {
  GlTransactions,
  GlTransactionsCreate,
  GlTransactionsLine,
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
  const [transactionsById, setTransactionsById] = useState<GlTransactions[]>([]);
  const [transactionsLineById, setTransactionsLineById] = useState<
    GlTransactionsLine[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingTransactionsLineById, setLoadingTransactionsLineById] =
    useState<boolean>(true);
  const [loadingTransactionsById, setLoadingTransactionsById] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errorTransactionsLineById, setErrorTransactionsLineById] = useState<
    string | null
  >(null);
   const [errorTransactionsById, setErrorTransactionsById] = useState<
    string | null
  >(null);

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

  const getTransactionsLineById = useCallback(
    async (id: number): Promise<ActionResult<GlTransactionsLine[]>> => {
      try {
        setLoadingTransactionsLineById(true);
        const { data } = await getTransactionsLineRequest(id);

        if (data.status === "OK") {
          setTransactionsLineById(data.data);
          setErrorTransactionsLineById(null);
          return { success: true, message: data.message, data: data.data };
        }

        setErrorTransactionsLineById(
          data.message || "Ocurrió un error inesperado",
        );
        return { success: false, message: data.message || "Error" };
      } catch (err) {
        const message = getAxiosMessage(err);
        setErrorTransactionsLineById(message);
        return { success: false, message };
      } finally {
        setLoadingTransactionsLineById(false);
      }
    },
    [],
  );


  const getTransactionsById = useCallback(
    async (id: number): Promise<ActionResult<GlTransactions[]>> => {
      try {
        setLoadingTransactionsById(true);
        const { data } = await getIdTransactionsRequest(id);

        if (data.status === "OK") {
          setTransactionsById(data.data);
          setErrorTransactionsById(null);
          return { success: true, message: data.message, data: data.data };
        }

        setErrorTransactionsById(
          data.message || "Ocurrió un error inesperado",
        );
        return { success: false, message: data.message || "Error" };
      } catch (err) {
        const message = getAxiosMessage(err);
        setErrorTransactionsById(message);
        return { success: false, message };
      } finally {
        setLoadingTransactionsById(false);
      }
    },
    [],
  );

  const createGlTransaction = useCallback(
    async (
      payload: GlTransactionsCreate,
    ): Promise<ActionResult<GlTransactions>> => {
      try {
        setLoading(true);
        const { data } = await createTransactionRequest(payload); // ApiResponse<GlTransactions>
        console.log(data, "la que llega");

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

  const resetGlTransactionsLineById = useCallback(() => {
    setTransactionsLineById([]);
    setLoadingTransactionsLineById(true);
    setErrorTransactionsLineById(null);
  }, []);

const resetGlTransactionsById = useCallback(() => {
    setTransactionsById([]);
    setLoadingTransactionsById(true);
    setErrorTransactionsById(null);
  }, [])

  return {
    transactions,
    transactionsLineById,
    transactionsById,
    loading,
    loadingTransactionsLineById,
    setLoadingTransactionsById,
    error,
    errorTransactionsLineById,
    errorTransactionsById,
    getTransactions,
    getTransactionsLineById,
    getTransactionsById,
    createGlTransaction,
    resetGlTransactions,
    resetGlTransactionsLineById,
    resetGlTransactionsById
  };
};
