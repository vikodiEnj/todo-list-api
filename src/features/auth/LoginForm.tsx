import { login } from "./authApi";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { getErrorMessage } from "../../api/getErrorMessage";
import type { LoginFormValues } from "../../types";
import type { ReactElement } from "react";

type LoginFormProps = {
  handleAuthSuccess: (token: string) => void;
};

const LoginForm = ({ handleAuthSuccess }: LoginFormProps): ReactElement => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: "onTouched",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function onSubmit(data: LoginFormValues): Promise<void> {
    setError(null);
    setSuccess(false);
    try {
      setLoading(true);
      const result = await login(data.email, data.password);
      localStorage.setItem("access_token", result.access_token);
      handleAuthSuccess(result.access_token);
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const password = watch("password");

  return (
    <div className="app">
      <h1>Вход</h1>
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <input
            className="form-input"
            placeholder="Введите почту"
            {...register("email", {
              required: "Поле обязательно для заполнения",
              pattern: {
                value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/,
                message: "Введите корректный email",
              },
            })}
          />
          {errors.email && <p className="error-text">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <input
            className="form-input"
            type="password"
            placeholder="Пароль"
            {...register("password", {
              required: "Укажите пароль",
              minLength: {
                value: 6,
                message: "Минимум 6 символов",
              },
            })}
          />
          {errors.password && (
            <p className="error-text">{errors.password.message}</p>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          Войти
        </button>
      </form>

      {loading && <p className="auth-status">Отправка...</p>}
      {error && <p className="error-text">{error}</p>}

      {success && (
        <div className="auth-success">
          <h3>Успешный вход</h3>
          <button className="btn btn-clear" onClick={() => setSuccess(false)}>
            Закрыть
          </button>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
