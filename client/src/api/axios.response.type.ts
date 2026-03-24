export type ApiResponse<T> = {
  status: "OK" | "ERROR";
  success: boolean;
  message: string;
  data: T;
};


export type ApiMessageResponse = {
  status: "OK" | "ERROR";
  message: string;
};
