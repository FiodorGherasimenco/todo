import * as States from "../constants/states";
import { completeTask, deleteTask } from "../api/tasks";
import { createMachine } from "../fsm";

type Context = {
  completed: boolean;
  deleted: boolean;
};

export default () => {
  let timeout: NodeJS.Timeout;
  const machine = createMachine<Context>({
    initialState: States.Idle,
    context: {
      completed: false,
      deleted: false,
    },
    states: {
      idle: {
        transitions: {
          complete: {
            target: States.Complete,
          },
          delete: {
            target: States.Hide,
          },
        },
      },
      [States.Complete]: {
        actions: {
          onEnter({ taskId }, instance) {
            if (!taskId || typeof taskId !== "number") {
              instance.transition("complete");
            } else {
              completeTask(taskId)
                .then(() => {
                  instance.setContext((context) => ({
                    ...context,
                    completed: true,
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
            target: States.Idle,
          },
          error: {
            target: States.Error,
          },
        },
      },
      [States.Hide]: {
        actions: {
          onEnter(params, instance) {
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
            target: States.Delete,
          },
          undo: {
            target: States.Idle,
          },
        },
      },
      [States.Delete]: {
        actions: {
          onEnter({ taskId }, instance) {
            if (!taskId || typeof taskId !== "number") {
              instance.transition("complete");
            } else {
              deleteTask(taskId).catch(() => {
                instance.transition("error");
              });
            }
          },
        },
        transitions: {
          error: {
            target: States.Error,
          },
        },
      },
      [States.Error]: {
        actions: {
          onEnter(_, instance) {
            timeout = setTimeout(() => {
              instance.transition("reset");
            }, 3000);
          },
          onExit() {
            clearTimeout(timeout);
          },
        },
        transitions: {
          reset: {
            target: States.Idle,
          },
          delete: {
            target: States.Hide,
          },
        },
      },
    },
  });

  return machine;
};
