import { useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  createCategoryRequest,
  deleteCategoryRequest,
  getCategoryRequest,
  updateCategoryRequest,
} from "../api/category.api";

import type {
  Category,
  CategoryCreateDTO,
  CategoryUpdateDTO,
} from "../types/category.types";

type ActionResult<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

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

export const useCategory = () => {
  const [category, setCategory] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const getCategory = useCallback(async (): Promise<
    ActionResult<Category[]>
  > => {
    try {
      setLoading(true);
      const { data } = await getCategoryRequest();

      if (data.status === "OK") {
        setCategory(data.data);
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

  const createCategory = useCallback(
    async (payload: CategoryCreateDTO): Promise<ActionResult<Category>> => {
      try {
        setLoading(true);
        const { data } = await createCategoryRequest(payload); // ApiResponse<Category>

        if (data.status === "OK") {
          // si el backend devuelve la categoria creada
          setCategory((prev) => [...prev, data.data]);
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

  const updateCategory = useCallback(
    async (
      id: number,
      payload: CategoryUpdateDTO,
    ): Promise<ActionResult<Category>> => {
      try {
        setLoading(true);
        const { data } = await updateCategoryRequest(id, payload); // ApiResponse<Category>

        if (data.status === "OK") {
          setCategory((prev) =>
            prev.map((cat) => (cat.idGlCategorie === id ? data.data : cat)),
          );
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

  const deleteCategory = useCallback(
    async (id: number): Promise<ActionResult> => {
      try {
        setLoading(true);
        const { data } = await deleteCategoryRequest(id); // ApiMessageResponse

        if (data.status === "OK") {
          setCategory((prev) => prev.filter((cat) => cat.idGlCategorie !== id));
          setError(null);
          return { success: true, message: data.message };
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

  const resetCategories = useCallback(() => {
    setCategory([]);
    setLoading(true);
    setError(null);
  }, []);

  return {
    category,
    loading,
    error,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
    resetCategories,
  };
};
