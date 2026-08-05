export async function register(email, password, name) {
  const response = await fetch(
    "https://todo-redev.onrender.com/api/auth/register",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    },
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Ошибка регистрации");
  }
  return data;
}

export async function login(email, password) {
  const response = await fetch(
    "https://todo-redev.onrender.com/api/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Неверные данные");
  }
  return data;
}
