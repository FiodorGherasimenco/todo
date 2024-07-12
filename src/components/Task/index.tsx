import { useRef } from "react";
import { createPortal } from "react-dom";
import { Todo } from "../../api/tasks";
import { ErrorMessage } from "../../constants/messages";
import * as States from "../../constants/states";
import { useMachine } from "../../hooks/useMachine";
import TaskMachine from "../../machines/task";
import { Button } from "../Button";
import { Notice } from "../Notice";
import style from "./style.module.css";

export type Props = {
  task: Todo;
};

export const Task = ({ task }: Props) => {
  const machineRef = useRef(TaskMachine());
  const [state, send] = useMachine(machineRef.current);
  const isCompleted = task.completed || state.context.completed;
  const isDeleted = state.value === States.Delete;
  const isHidden = state.value === States.Hide;
  const isError = state.value === States.Error;
  const isDisabled = isDeleted || state.value === States.Complete || isError;
  const handleCompleteClick = () => {
    send("complete", {
      taskId: task.id,
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
    send("reset");
  };

  if (isDeleted) {
    return null;
  }

  return (
    <div className={style.task}>
      {isError &&
        createPortal(
          <Notice message={ErrorMessage} onHide={handleNoticeHide} />,
          document.body,
        )}
      <div className={`${style.truncated} ${isCompleted && style.completed}`}>
        {task.todo}
      </div>
      <div className={style.actions}>
        {isHidden && (
          <Button variant="secondary" onClick={handleUndoClick}>
            Undo
          </Button>
        )}
        {!isHidden && (
          <Button
            variant="secondary"
            onClick={handleCompleteClick}
            disabled={isCompleted || isDisabled}
          >
            Complete
          </Button>
        )}
        {!isHidden && (
          <Button
            variant="secondary"
            onClick={handleDeleteClick}
            disabled={isDisabled}
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
};
