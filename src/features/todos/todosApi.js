export async function getTodos(token) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const json = await response.json();
  if (!response.ok) {
    throw new Error(json.message || "Ошибка");
  }
  return json.data;
}

export async function createTodo(title, token) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Не удалось создать задачу");
  }
  return data;
}

export async function toggleTodo(id, token) {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/todos/${id}/toggle`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Не удалось изменить статус задачи");
  }
  return data;
}

export async function deleteTodo(id, token) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 204) {
    return null;
  }
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Не удалось удалить задачу");
  }
  return data;
}

export async function editTodo(id, title, token) {
  const response = await fetch(`${import.meta.env.VITE_API_URL}/todos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Не удалось изменить задачу");
  }
  return data;
}
