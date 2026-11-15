export type SortOrder = "newest" | "oldest";

export type Filter = "All" | "Active" | "Completed";

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  userId: number;
};

export type Meta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type TaskResponse = {
  data: Task[];
  meta: Meta;
};

export type LoginResponse = {
  access_token: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};

export type RegisterFormValues = {
  name: string;
  gender: "male" | "female";
  email: string;
  password: string;
};
