import axios from "@/api/axios.config";
import type { ApiResponse } from "@/api/axios.response.type"
import type { AxiosResponse } from "axios";
import type { GlTransactions, GlTransactionsCreate,GlTransactionsLine } from "../types/transactions.types";



export const getTransactionsRequest = async (): Promise<AxiosResponse<ApiResponse<GlTransactions[]>>> => axios.get("/transaction");
export const getIdTransactionsRequest = async (id: number): Promise<AxiosResponse<ApiResponse<GlTransactions[]>>> => axios.get(`/transaction/${id}`);
export const createTransactionRequest = async (data: GlTransactionsCreate): Promise<AxiosResponse<ApiResponse<GlTransactions>>> => axios.post("/transaction",data);
export const getTransactionsLineRequest = async (id: number): Promise<AxiosResponse<ApiResponse<GlTransactionsLine[]>>> => axios.get(`/transactionLine/${id}`)
export const cancelTransactionRequest = async (id: number): Promise<AxiosResponse<ApiResponse<GlTransactions[]>>> => axios.put(`/transaction/${id}`)