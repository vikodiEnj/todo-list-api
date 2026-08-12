import "./App.css";
import TaskList from "./features/todos/TaskList";
import TaskInput from "./features/todos/TaskInput";
import TaskFilter from "./features/todos/TaskFilter";
import Footer from "./features/todos/Footer";
import LoginForm from "./features/auth/LoginForm";
import RegistrationForm from "./features/auth/RegistrationForm";
import { useState, useEffect } from "react";
import {
  createTodo,
  getTodos,
  toggleTodo,
  deleteTodo,
  editTodo,
} from "./features/todos/todosApi";
import { Routes, Route, useNavigate, Navigate } from "react-router";

function PrivateRoute({ token, children }) {
  if (!token) {
    return <Navigate to="/login" />;
  }
  return children;
}

function App() {
  const [token, setToken] = useState(() =>
    localStorage.getItem("access_token"),
  );

  function handleAuthSuccess(newToken) {
    setToken(newToken);
    navigate("/todo");
  }

  const [loading, setLoading] = useState(false);

  const [actionLoading, setActionLoading] = useState(false);

  const [error, setError] = useState(null);

  const [authView, setAuthView] = useState("choice");

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!token) return;
    async function loadTodos() {
      try {
        setLoading(true);
        const result = await getTodos(token);
        setTasks(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadTodos();
  }, [token]);

  const [filter, setFilter] = useState("All");

  const filteredTasks = tasks.filter((item) => {
    if (filter === "All") {
      return true;
    } else if (filter === "Active") {
      return item.completed === false;
    } else {
      return item.completed === true;
    }
  });

  async function toggleTask(id) {
    try {
      setActionLoading(true);
      const result = await toggleTodo(id, token);
      setTasks(tasks.map((task) => (task.id === id ? result : task)));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function deleteTask(id) {
    try {
      setActionLoading(true);
      await deleteTodo(id, token);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function addTask(task) {
    try {
      setActionLoading(true);
      const result = await createTodo(task, token);
      setTasks([...tasks, result]);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function editTask(id, newText) {
    try {
      setActionLoading(true);
      const result = await editTodo(id, newText, token);
      setTasks(tasks.map((task) => (task.id === id ? result : task)));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  async function clearCompleted() {
    try {
      setActionLoading(true);
      const completedTasks = tasks.filter((task) => task.completed === true);
      await Promise.all(
        completedTasks.map((task) => deleteTodo(task.id, token)),
      );
      setTasks(tasks.filter((task) => task.completed === false));
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  }

  const leftTasks = tasks.filter((item) => item.completed === false).length;

  const [sortOrder, setSortOrder] = useState("newest");

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
                {loading && <p>Загрузка задач...</p>}
                {error && <p>{error}</p>}
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
