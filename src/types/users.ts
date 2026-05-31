export type User = {
  id: string;
  username: string;
  created_at: string;
  updated_at: string;
};

export type UserPayload = {
  username: string;
  password: string;
};
