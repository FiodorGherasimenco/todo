import { getAllTasks, Todo, addTask } from "../api/tasks";
import { createMachine } from "../fsm";

type Context = { loading: boolean; tasks: Todo[]; errorMessage: string };

let timeout: number;

export default createMachine<Context>({
  initialState: "idle",
  context: {
    loading: true,
    errorMessage: "",
    tasks: [],
  },
  states: {
    idle: {
      actions: {
        onEnter(_, instance) {
          instance.setContext((context) => ({ ...context, loading: false }));
        },
        onExit(instance) {
          instance.setContext((context) => ({
            ...context,
            loading: true,
          }));
          clearTimeout(timeout);
        },
      },
      transitions: {
        fetch: {
          target: "tasks",
        },
        add: {
          target: "create",
        },
      },
    },
    tasks: {
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
          target: "idle",
        },
        error: {
          target: "error",
        },
      },
    },
    create: {
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
          target: "idle",
        },
        error: {
          target: "error",
        },
      },
    },
    error: {
      actions: {
        onEnter(_, instance) {
          instance.setContext((context) => ({
            ...context,
            loading: false,
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
