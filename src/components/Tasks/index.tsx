import { useEffect } from "react";
import { useMachine } from "../../hooks/useMachine";
import TasksMachine from "../../machines/tasks";
import { TaskForm } from "../TaskForm";
import { Task } from "../Task";
import { Preloader } from "../Preloader";
import style from "./style.module.css";
import { Notice } from "../Notice";
import { createPortal } from "react-dom";
import * as States from "../../constants/states";
import { ErrorMessage } from "../../constants/messages";

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
      <TaskForm onSubmit={handleSubmit} />
      <div className={style.tasks}>
        <Preloader inProgress={isLoading} />
        {tasks.map((task, i) => (
          <Task task={task} key={`${task.id}-${i}`} />
        ))}
      </div>
    </div>
  );
};
