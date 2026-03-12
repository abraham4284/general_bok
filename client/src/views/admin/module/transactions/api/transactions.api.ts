import axios from "@/api/axios.config";
import type { ApiMessageResponse,ApiResponse} from "@/api/axios.response.type"
import type { AxiosResponse } from "axios";
import type { GlTransactions, GlTransactionsCreate } from "../types/transactions.types";



export const getTransactionsRequest = async (): Promise<AxiosResponse<ApiResponse<GlTransactions[]>>> => axios.get("/transaction");
export const createTransactionRequest = async (data: GlTransactionsCreate): Promise<AxiosResponse<ApiResponse<GlTransactions>>> => axios.post("/transaction",data);
