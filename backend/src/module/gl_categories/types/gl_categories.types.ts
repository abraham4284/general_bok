export type GlCategoryDTO = {
  name: string;
  nature: "INCOME" | "EXPENSE" | "ADJUSTMENT" | "TRANSFER" | "OTHER" | string;
  is_active: boolean;
};

export type GlCategory = {
  idGlCategory: number;
  name: string;
  nature: "INCOME" | "EXPENSE" | "ADJUSTMENT" | "TRANSFER" | "OTHER" | string;
  is_active: boolean;
  create_at?: string;
};

export type GlCategoryUpdate = {
  name: string;
  nature: "INCOME" | "EXPENSE" | "ADJUSTMENT" | "TRANSFER" | "OTHER" | string;
  is_active: boolean;
  create_at?: string;
};
