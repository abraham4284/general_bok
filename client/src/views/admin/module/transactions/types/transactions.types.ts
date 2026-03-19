export type GlTransactions = {
  idGltransaction: number;
  occurred_at: string;
  description: string;
  status: "POSTED" | "VOID";
  source: "MANUAL" | "SYSTEM" | "IMPORT";
  external_ref: string;
  created_at: string;
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
