import { register as registerUser } from "./api/authApi";
import { useForm } from "react-hook-form";
import { useState } from "react";

const RegistrationForm = ({ handleAuthSuccess }) => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onTouched",
  });

  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function onSubmit(data) {
    setError(null);
    setSuccess(false);
    try {
      setLoading(true);
      const result = await registerUser(data.email, data.password, data.name);
      localStorage.setItem("access_token", result.access_token);
      handleAuthSuccess(result.access_token);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  const password = watch("password");

  return (
    <div className="app">
      <h1>Регистрация</h1>
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <input
            className="form-input"
            placeholder="Логин"
            {...register("name", { required: "Укажите логин" })}
          />
          {errors.name && <p className="error-text">{errors.name.message}</p>}
        </div>

        <div className="form-group">
          <span className="form-label">Выберите пол</span>
          <div className="radio-group">
            <label className="radio-option">
              <input
                type="radio"
                {...register("gender", { required: "Выберите пол" })}
                value="male"
              />
              Мужской
            </label>
            <label className="radio-option">
              <input
                type="radio"
                {...register("gender", { required: "Выберите пол" })}
                value="female"
              />
              Женский
            </label>
          </div>
          {errors.gender && (
            <p className="error-text">{errors.gender.message}</p>
          )}
        </div>

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
          {errors.email && (
            <p className="error-text">{errors.email.message}</p>
          )}
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
          Отправить
        </button>
      </form>

      {loading && <p className="auth-status">Отправка...</p>}
      {error && <p className="error-text">{error}</p>}

      {success && (
        <div className="auth-success">
          <h3>Успешно зарегистрировано!</h3>
          <button className="btn btn-clear" onClick={() => setSuccess(false)}>
            Закрыть
          </button>
        </div>
      )}
    </div>
  );
};

export default RegistrationForm;
