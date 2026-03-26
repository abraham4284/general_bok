export type GlTransactions = {
  idGltransaction: number;
  occurred_at: string;
  description: string;
  status: "POSTED" | "VOID" | "OK" | "ANULADO";
  source: "MANUAL" | "SYSTEM" | "IMPORT";
  external_ref: string;
  created_at: string;
  amount: number;
  category_name: string;
  nature: string;
  idGlCategorie: number
};

export type GlTransactionsCreate = {
  idGltransaction: number;
  occurred_at: string;
  description: string;
  status: "POSTED" | "VOID";
  source: "MANUAL" | "SYSTEM" | "IMPORT";
  external_ref: string;
  create_at: string;
};

export type GlTransactionsLine = {
  idGlTransactionLine: number;
  account_name: string;
  category_name: string;
  nature: string;
  amount: number;
  created_at: string;
};


export type TransactionFilterState = {
  date: string;
  fromDate: string;
  toDate: string;
  categoryId: string;
  nature: "" | "INCOME" | "EXPENSE" | "ADJUSTMENT" | "TRANSFER" | "OTHER";
};
