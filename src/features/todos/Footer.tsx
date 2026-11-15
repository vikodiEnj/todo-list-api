import type { ReactElement } from "react";

type FooterProps = {
  clearCompleted: () => void;
  leftTasks: number;
  actionLoading: boolean;
};

const Footer = ({
  clearCompleted,
  leftTasks,
  actionLoading,
}: FooterProps): ReactElement => {
  return (
    <div className="footer">
      <p className="left-count">Осталось задач: {leftTasks}</p>
      <button
        disabled={actionLoading}
        className="btn btn-clear"
        onClick={clearCompleted}
      >
        Очистить выполненные
      </button>
    </div>
  );
};

export default Footer;
