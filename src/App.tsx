import "./App.css";
import TaskList from "./features/todos/TaskList";
import TaskInput from "./features/todos/TaskInput";
import TaskFilter from "./features/todos/TaskFilter";
import Footer from "./features/todos/Footer";
import LoginForm from "./features/auth/LoginForm";
import RegistrationForm from "./features/auth/RegistrationForm";
import { useState } from "react";
import type { ReactNode } from "react";
import {
  createTodo,
  getTodos,
  toggleTodo,
  deleteTodo,
  editTodo,
} from "./features/todos/todosApi";
import { getErrorMessage } from "./api/getErrorMessage";
import { Routes, Route, useNavigate, Navigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Filter, SortOrder } from "./types";

function PrivateRoute({
  token,
  children,
}: {
  token: string | null;
  children: ReactNode;
}) {
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  const [token, setToken] = useState(() =>
    localStorage.getItem("access_token"),
  );

  function handleAuthSuccess(newToken: string) {
    setToken(newToken);
    navigate("/todo");
  }

  const queryClient = useQueryClient();

  const {
    data: tasks = [],
    isLoading,
    error: queryError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: () => getTodos(token!),
    enabled: !!token,
  });

  const [filter, setFilter] = useState<Filter>("All");

  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

  const filteredTasks = tasks.filter((item) => {
    if (filter === "All") {
      return true;
    } else if (filter === "Active") {
      return item.completed === false;
    } else {
      return item.completed === true;
    }
  });

  const toggleMutation = useMutation({
    mutationFn: (id: number) => toggleTodo(id, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  function toggleTask(id: number): void {
    toggleMutation.mutate(id);
  }

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteTodo(id, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  function deleteTask(id: number): void {
    deleteMutation.mutate(id);
  }

  const addMutation = useMutation({
    mutationFn: (title: string) => createTodo(title, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  function addTask(title: string): void {
    addMutation.mutate(title);
  }

  const editMutation = useMutation({
    mutationFn: ({ id, title }: { id: number; title: string }) =>
      editTodo(id, title, token!),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  function editTask(id: number, title: string): void {
    editMutation.mutate({ id, title });
  }

  const clearMutation = useMutation({
    mutationFn: () => {
      const completed = tasks.filter((task) => task.completed);
      return Promise.all(completed.map((task) => deleteTodo(task.id, token!)));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["todos"] }),
  });

  function clearCompleted(): void {
    clearMutation.mutate();
  }

  const actionLoading =
    addMutation.isPending ||
    toggleMutation.isPending ||
    deleteMutation.isPending ||
    editMutation.isPending ||
    clearMutation.isPending;

  const error =
    queryError ??
    addMutation.error ??
    toggleMutation.error ??
    deleteMutation.error ??
    editMutation.error ??
    clearMutation.error;

  const leftTasks = tasks.filter((item) => item.completed === false).length;

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortOrder === "newest") {
      return b.id - a.id;
    } else {
      return a.id - b.id;
    }
  });

  const navigate = useNavigate();

  return (
    <>
      <Routes>
        <Route
          path="/register"
          element={<RegistrationForm handleAuthSuccess={handleAuthSuccess} />}
        />
        <Route
          path="/login"
          element={<LoginForm handleAuthSuccess={handleAuthSuccess} />}
        />
        <Route
          path="/todo"
          element={
            <PrivateRoute token={token}>
              <div className="app">
                <h1>Приветствую проверяющего</h1>
                <TaskInput addTask={addTask} actionLoading={actionLoading} />
                <TaskFilter
                  filter={filter}
                  setFilter={setFilter}
                  sortOrder={sortOrder}
                  setSortOrder={setSortOrder}
                />
                {isLoading && <p>Загрузка задач...</p>}
                {error && <p>{getErrorMessage(error)}</p>}
                <TaskList
                  actionLoading={actionLoading}
                  tasks={sortedTasks}
                  toggleTask={toggleTask}
                  deleteTask={deleteTask}
                  editTask={editTask}
                />
                <Footer
                  actionLoading={actionLoading}
                  clearCompleted={clearCompleted}
                  leftTasks={leftTasks}
                />
              </div>
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={token ? "/todo" : "/login"} />}
        />
      </Routes>
    </>
  );
}

export default App;
