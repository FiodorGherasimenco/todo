import { completeTask, deleteTask } from "../api/tasks";
import { createMachine } from "../fsm";

type Context = {
  loading: boolean;
  completed: boolean;
  deleted: boolean;
  hidden: boolean;
  errorMessage?: string;
};

let timeout: number;

export default () =>
  createMachine<Context>({
    initialState: "idle",
    context: {
      loading: false,
      completed: false,
      deleted: false,
      hidden: false,
    },
    states: {
      idle: {
        actions: {
          onEnter(_, instance) {
            instance.setContext((context) => ({ ...context, loading: false }));
          },
          onExit(instance) {
            clearTimeout(timeout);
            instance.setContext((context) => ({
              ...context,
              loading: true,
            }));
          },
        },
        transitions: {
          complete: {
            target: "complete",
          },
          delete: {
            target: "hide",
          },
        },
      },
      complete: {
        actions: {
          onEnter({ taskId, completed }, instance) {
            if (!taskId || typeof taskId !== "number") {
              instance.transition("complete");
            } else {
              completeTask(taskId)
                .then(() => {
                  instance.setContext((context) => ({
                    ...context,
                    completed: !completed,
                  }));
                  instance.transition("complete");
                })
                .catch(() => {
                  instance.transition("error");
                });
            }
          },
        },
        transitions: {
          complete: {
            target: "idle",
          },
        },
      },
      hide: {
        actions: {
          onEnter(params, instance) {
            instance.setContext((context) => ({
              ...context,
              hidden: true,
            }));
            timeout = setTimeout(() => {
              instance.transition("complete", params);
            }, 3000);
          },
          onExit() {
            clearTimeout(timeout);
          },
        },
        transitions: {
          complete: {
            target: "delete",
          },
          undo: {
            target: "idle",
            action(instance) {
              instance.setContext((context) => ({
                ...context,
                hidden: false,
              }));
            },
          },
        },
      },
      delete: {
        actions: {
          onEnter({ taskId }, instance) {
            if (!taskId || typeof taskId !== "number") {
              instance.transition("complete");
            } else {
              deleteTask(taskId)
                .then(() => {
                  instance.setContext((context) => ({
                    ...context,
                    deleted: true,
                  }));
                  instance.transition("complete");
                })
                .catch(() => {
                  instance.transition("error");
                });
            }
          },
        },
        transitions: {
          complete: {
            target: "idle",
          },
          error: {
            target: "error",
            action(instance) {
              instance.setContext((context) => ({
                ...context,
                loading: false,
                hidden: false,
              }));
            },
          },
        },
      },
      error: {
        actions: {
          onEnter(_, instance) {
            instance.setContext((context) => ({
              ...context,
              errorMessage: "Something went wrong",
            }));
            timeout = setTimeout(() => {
              instance.transition("idle");
            }, 3000);
          },
          onExit(instance) {
            clearTimeout(timeout);
            instance.setContext((context) => ({
              ...context,
              errorMessage: "",
            }));
          },
        },
        transitions: {
          idle: {
            target: "idle",
          },
        },
      },
    },
  });
