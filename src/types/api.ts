export type ApiResponse<T> = {
  error?: boolean;
  msg?: string;
  status?: string;
  data?: T;
};

export type Paginated<T> = {
  items: T[];
  total: number;
};
