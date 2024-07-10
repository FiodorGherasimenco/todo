import { useEffect } from "react";
import { useMachine } from "../../hooks/useMachine";
import TasksMachine from "../../machines/tasks";
import { TaskForm } from "../TaskForm";
import { Task } from "../Task";
import { Preloader } from "../Preloader";
import style from "./style.module.css";
import { Notice } from "../Notice";
import { createPortal } from "react-dom";

export const Tasks = () => {
  const [{ loading, tasks, errorMessage }, send] = useMachine(TasksMachine);

  const handleSubmit = async ({ title }: { title: string }) => {
    send("add", {
      title,
    });
  };

  const handleNoticeHide = () => {
    send("idle");
  };

  useEffect(() => {
    send("fetch");
  }, [send]);

  return (
    <div className={style.container}>
      {errorMessage &&
        createPortal(
          <Notice message={errorMessage} onHide={handleNoticeHide} />,
          document.body,
        )}
      <TaskForm onSubmit={handleSubmit} />
      <div className={style.tasks}>
        <Preloader inProgress={loading} />
        {tasks.map((task, i) => (
          <Task task={task} key={`${task.id}-${i}`} />
        ))}
      </div>
    </div>
  );
};
