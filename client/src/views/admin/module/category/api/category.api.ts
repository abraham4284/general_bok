import axios from "@/api/axios.config";
import type { ApiMessageResponse,ApiResponse} from "@/api/axios.response.type"
import type { Category, CategoryCreateDTO,CategoryUpdateDTO} from "@/views/admin/module/category/types/category.types"
import type { AxiosResponse } from "axios";


export const getCategoryRequest = async (): Promise<AxiosResponse<ApiResponse<Category[]>>> => axios.get("/glcategorie");
export const createCategoryRequest = async (data: CategoryCreateDTO): Promise<AxiosResponse<ApiResponse<Category>>> => axios.post("/glcategorie",data);
export const updateCategoryRequest = async (id: number, data:CategoryUpdateDTO): Promise<AxiosResponse<ApiResponse<Category>>>=> axios.put(`/glcategorie/${id}`,data);
export const deleteCategoryRequest = async (id: number): Promise<AxiosResponse<ApiMessageResponse>> => axios.delete(`/idGlCategorie/${id}`);