import { useState } from "react";
import type {
  KeyboardEvent,
  ReactElement,
  ChangeEvent,
  MouseEvent,
} from "react";
import type { Task } from "../../types";

type TaskItemProps = {
  item: Task;
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  editTask: (id: number, title: string) => void;
  actionLoading: boolean;
};

const TaskItem = ({
  item,
  toggleTask,
  deleteTask,
  editTask,
  actionLoading,
}: TaskItemProps): ReactElement => {
  const [isEditing, setIsEditing] = useState(false);

  const [draft, setDraft] = useState(item.title);

  function saveEdit(): void {
    if (draft.trim().length === 0) {
      return;
    } else {
      editTask(item.id, draft);
      setIsEditing(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>): void {
    if (e.key === "Enter") {
      saveEdit();
    } else if (e.key === "Escape") {
      setIsEditing(false);
    }
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>): void {
    setDraft(e.target.value);
  }

  function handleSaveMouseDown(e: MouseEvent<HTMLButtonElement>): void {
    e.preventDefault();
  }

  return (
    <li className="task-item">
      <input
        disabled={actionLoading}
        type="checkbox"
        className="task-checkbox"
        checked={item.completed}
        onChange={() => toggleTask(item.id)}
      />
      {isEditing ? (
        <div className="edit-group">
          <input
            className="edit-input"
            autoFocus
            value={draft}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsEditing(false)}
          />
          <button
            disabled={actionLoading}
            className="btn btn-save"
            onMouseDown={handleSaveMouseDown}
            onClick={saveEdit}
          >
            Сохранить
          </button>
        </div>
      ) : (
        <span className={item.completed ? "task-text completed" : "task-text"}>
          {item.title}
        </span>
      )}
      {!isEditing && (
        <div className="task-actions">
          <button
            disabled={actionLoading}
            className="btn btn-edit"
            onClick={() => {
              setIsEditing(true);
              setDraft(item.title);
            }}
          >
            Редактировать
          </button>
          <button
            disabled={actionLoading}
            className="btn btn-delete"
            onClick={() => deleteTask(item.id)}
          >
            ×
          </button>
        </div>
      )}
    </li>
  );
};

export default TaskItem;
