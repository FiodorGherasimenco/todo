import { createMachine } from "../fsm";

type Context = {
  loading: boolean;
  formData: {
    title: string;
  };
};

export default createMachine<Context>({
  initialState: "idle",
  context: {
    loading: false,
    formData: {
      title: "",
    },
  },
  states: {
    idle: {
      actions: {
        onEnter(_, instance) {
          instance.setContext((context) => ({ ...context, loading: false }));
        },
      },
      transitions: {
        submit: {
          target: "loading",
        },
        update: {
          target: "change",
        },
        reset: {
          target: "clear",
        },
      },
    },
    change: {
      actions: {
        onEnter(fields, instance) {
          instance.setContext((context) => ({
            ...context,
            formData: {
              ...context.formData,
              ...fields,
            },
          }));
          instance.transition("complete");
        },
      },
      transitions: {
        complete: {
          target: "idle",
        },
      },
    },
    clear: {
      actions: {
        onEnter(_, instance) {
          instance.setContext((context) => ({
            ...context,
            formData: {
              title: "",
            },
          }));
          instance.transition("complete");
        },
      },
      transitions: {
        complete: {
          target: "idle",
        },
      },
    },
    loading: {
      actions: {
        onEnter(_, instance) {
          instance.setContext((context) => ({ ...context, loading: true }));
        },
      },
      transitions: {
        complete: {
          target: "idle",
        },
        reset: {
          target: "clear",
        },
      },
    },
  },
});
