export type ApiResponse<T> = {
  status: "OK" | "ERROR";
  message: string;
  data: T;
};


export type ApiMessageResponse = {
  status: "OK" | "ERROR";
  message: string;
};
