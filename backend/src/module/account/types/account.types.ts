export type AccountDTO = {
  name: string;
  type: "CASH" | "BANK" | "WALLET" | "OTHER" | string
  currency: string; // "ARS"
  balance: number;
};
export type Account = {
  idAccount: number;
  name: string;
  type: string;
  currency: string;
  balance: number;
  is_active: boolean;
  create_at?: string;
};

export type AccountUpdate = {
  name: string;
  type: string;
  currency: string;
  balance: number;
  is_active: boolean;
  create_at?: string;
};

