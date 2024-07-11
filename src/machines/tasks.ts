import * as States from "../constants/states";
import { createMachine } from "../fsm";
import { getAllTasks, Todo, addTask } from "../api/tasks";

type Context = { tasks: Todo[] };

let timeout: NodeJS.Timeout;

export default createMachine<Context>({
  initialState: States.Idle,
  context: {
    tasks: [],
  },
  states: {
    [States.Idle]: {
      transitions: {
        fetch: {
          target: States.Fetch,
        },
        add: {
          target: States.Create,
        },
      },
    },
    [States.Fetch]: {
      actions: {
        onEnter(_, instance) {
          getAllTasks()
            .then(({ todos }) => {
              instance.setContext((context) => ({
                ...context,
                tasks: todos,
              }));
              instance.transition("complete");
            })
            .catch(() => {
              instance.transition("error");
            });
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
    [States.Create]: {
      actions: {
        onEnter({ title }, instance) {
          if (!title || typeof title !== "string" || !title.length) {
            instance.transition("complete");
          } else {
            addTask(title)
              .then((task) => {
                instance.setContext((context) => ({
                  ...context,
                  tasks: [...context.tasks, task],
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
    [States.Error]: {
      actions: {
        onEnter(_, instance) {
          timeout = setTimeout(() => {
            instance.transition("switch");
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
      },
    },
  },
});
