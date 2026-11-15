import { instance } from "../../api/instance";
import type { Task, TaskResponse } from "../../types";

export async function getTodos(token: string): Promise<Task[]> {
  const response = await instance.get<TaskResponse>("todos", {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data.data;
}

export async function createTodo(title: string, token: string): Promise<Task> {
  const response = await instance.post<Task>(
    "todos",
    { title },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
}

export async function toggleTodo(id: number, token: string): Promise<Task> {
  const response = await instance.patch<Task>(`todos/${id}/toggle`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
}

export async function deleteTodo(id: number, token: string): Promise<void> {
  await instance.delete(`todos/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function editTodo(
  id: number,
  title: string,
  token: string,
): Promise<Task> {
  const response = await instance.patch<Task>(
    `todos/${id}`,
    { title },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
}
