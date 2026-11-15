import TaskItem from "./TaskItem";
import type { ReactElement } from "react";
import type { Task } from "../../types";

type TaskListProps = {
  tasks: Task[];
  toggleTask: (id: number) => void;
  deleteTask: (id: number) => void;
  editTask: (id: number, title: string) => void;
  actionLoading: boolean;
};

const TaskList = ({
  tasks,
  toggleTask,
  deleteTask,
  editTask,
  actionLoading,
}: TaskListProps): ReactElement => {
  return (
    <ul className="task-list">
      {tasks.length === 0 && <li className="empty-state">Задач нет</li>}
      {tasks.map((item) => (
        <TaskItem
          actionLoading={actionLoading}
          key={item.id}
          item={item}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
          editTask={editTask}
        />
      ))}
    </ul>
  );
};

export default TaskList;
