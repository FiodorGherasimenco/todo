import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ErrorMessage } from "../../constants/messages";
import * as States from "../../constants/states";
import { useMachine } from "../../hooks/useMachine";
import TasksMachine from "../../machines/tasks";
import { Notice } from "../Notice";
import { Preloader } from "../Preloader";
import { Task } from "../Task";
import { TaskForm } from "../TaskForm";
import style from "./style.module.css";

export const Tasks = () => {
  const [state, send] = useMachine(TasksMachine);
  const tasks = state.context.tasks;
  const isLoading = state.value === States.Fetch;
  const isError = state.value === States.Error;

  const handleSubmit = async ({ title }: { title: string }) => {
    send("add", {
      title,
    });
  };

  const handleNoticeHide = () => {
    send("reset");
  };

  useEffect(() => {
    send("fetch");
  }, [send]);

  return (
    <div className={style.container}>
      {isError &&
        createPortal(
          <Notice message={ErrorMessage} onHide={handleNoticeHide} />,
          document.body,
        )}
      <TaskForm onSubmit={handleSubmit} disabled={isLoading} />
      <div className={style.tasks}>
        <Preloader inProgress={isLoading} />
        {tasks.map((task, i) => (
          <Task task={task} key={`${task.id}-${i}`} />
        ))}
      </div>
    </div>
  );
};
