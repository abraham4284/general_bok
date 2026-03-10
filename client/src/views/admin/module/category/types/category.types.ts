export type Category = {
  idGlCategorie: number;
  name: string;
  nature: "INCOME" | "EXPENSE" | "ADJUSTEMENT" | "TRANSFER" | "OTHER";
  is_active: boolean;
  create_at: string;
};

export type CategoryCreateDTO = {
  idGlCategorie: number;
  name: string;
  nature: "INCOME" | "EXPENSE" | "ADJUSTEMENT" | "TRANSFER" | "OTHER";
  is_active: boolean;
};

export type CategoryUpdateDTO = CategoryCreateDTO;
