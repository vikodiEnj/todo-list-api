import type { ReactElement } from "react";
import type { Filter, SortOrder } from "../../types";

type TaskFilterProps = {
  filter: Filter;
  setFilter: (arg: Filter) => void;
  sortOrder: SortOrder;
  setSortOrder: (arg: SortOrder) => void;
};

const TaskFilter = ({
  filter,
  setFilter,
  sortOrder,
  setSortOrder,
}: TaskFilterProps): ReactElement => {
  return (
    <div className="task-filter">
      <div className="filter-group">
        <button
          className={filter === "All" ? "btn btn-chip active" : "btn btn-chip"}
          onClick={() => setFilter("All")}
        >
          Все
        </button>
        <button
          className={
            filter === "Active" ? "btn btn-chip active" : "btn btn-chip"
          }
          onClick={() => setFilter("Active")}
        >
          Активные
        </button>
        <button
          className={
            filter === "Completed" ? "btn btn-chip active" : "btn btn-chip"
          }
          onClick={() => setFilter("Completed")}
        >
          Выполненные
        </button>
      </div>
      <div className="filter-group">
        <button
          className={
            sortOrder === "newest" ? "btn btn-chip active" : "btn btn-chip"
          }
          onClick={() => setSortOrder("newest")}
        >
          Сначала новые
        </button>
        <button
          className={
            sortOrder === "oldest" ? "btn btn-chip active" : "btn btn-chip"
          }
          onClick={() => setSortOrder("oldest")}
        >
          Сначала старые
        </button>
      </div>
    </div>
  );
};

export default TaskFilter;
