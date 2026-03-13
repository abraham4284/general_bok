
export type GlTransaction= {
  ocurred_at: string;
  description: string;
  status: string;
  source: string;
  external_ref: string;
  created_at: string;
};


export type TransactionDTO = {
  ocurred_at: string;
  description: string;
  external_ref: string;
};

export type TransactionUpdate = {
  ocurred_at: string;
  description: string;
  status: "POSTED" | "VOID" | "OK" | "ANULADO";
  source: "MANUAL" | "SYSTEM" | "IMPORT" | string;
  external_ref: string;
  created_at?: string;
};

export type TransactionLineDTO = {
  idAccount: number;
  idAccountTo?: number;
  idGlCategorie: number;
  idUser: number;
  amount: number;
  direction?: "INCREMENT" | "DECREMENT" | string;
};
