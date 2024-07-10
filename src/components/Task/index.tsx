import { useRef } from "react";
import { createPortal } from "react-dom";
import { Todo } from "../../api/tasks";
import { useMachine } from "../../hooks/useMachine";
import { Button } from "../Button";
import TaskMachine from "../../machines/task";
import { Notice } from "../Notice";
import style from "./style.module.css";

export type Props = {
  task: Todo;
};

export const Task = ({ task }: Props) => {
  const machineRef = useRef(TaskMachine());
  const [state, send] = useMachine(machineRef.current);
  const completed = task.completed || state.completed;

  const handleCompleteClick = () => {
    send("complete", {
      taskId: task.id,
      completed,
    });
  };
  const handleDeleteClick = () => {
    send("delete", {
      taskId: task.id,
    });
  };

  const handleUndoClick = () => {
    send("undo");
  };

  const handleNoticeHide = () => {
    send("idle");
  };

  if (state.deleted) {
    return null;
  }

  return (
    <div className={style.task}>
      {state.errorMessage &&
        createPortal(
          <Notice message={state.errorMessage} onHide={handleNoticeHide} />,
          document.body,
        )}
      <div className={`${style.truncated} ${completed && style.completed}`}>
        {task.todo}
      </div>
      <div className={style.actions}>
        {state.hidden && (
          <Button variant="secondary" onClick={handleUndoClick}>
            Undo
          </Button>
        )}
        {!state.hidden && (
          <Button
            variant="secondary"
            onClick={handleCompleteClick}
            disabled={state.loading}
          >
            Complete
          </Button>
        )}
        {!state.hidden && (
          <Button
            variant="secondary"
            onClick={handleDeleteClick}
            disabled={state.loading}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};
