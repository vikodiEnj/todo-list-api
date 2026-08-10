import TaskItem from "./TaskItem";

const TaskList = ({
  tasks,
  toggleTask,
  deleteTask,
  editTask,
  actionLoading,
}) => {
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
