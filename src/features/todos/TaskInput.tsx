import { useState } from "react";
import type { ChangeEvent, ReactElement } from "react";
import { useRef } from "react";

type TaskInputProps = {
  addTask: (title: string) => void;
  actionLoading: boolean;
};

const TaskInput = ({
  addTask,
  actionLoading,
}: TaskInputProps): ReactElement => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    setText(e.target.value);
  }

  function handleAdd(): void {
    if (text.trim().length === 0) {
      setError("Строка не может быть пустой");
      return;
    } else {
      addTask(text);
      setText("");
      setError("");
      inputRef.current?.focus();
    }
  }

  return (
    <div className="task-input">
      <div className="task-input-row">
        <input
          ref={inputRef}
          type="text"
          className="task-input-field"
          placeholder="Что нужно сделать?"
          value={text}
          onChange={handleChange}
        />
        <button
          disabled={actionLoading}
          className="btn btn-primary"
          onClick={handleAdd}
        >
          Добавить
        </button>
      </div>
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default TaskInput;
