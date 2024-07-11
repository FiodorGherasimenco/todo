import * as States from "../constants/states";
import { createMachine } from "../fsm";

type Context = {
  title: string;
};

export default createMachine<Context>({
  initialState: States.Idle,
  context: {
    title: "",
  },
  states: {
    [States.Idle]: {
      transitions: {
        change: {
          target: States.Change,
        },
        reset: {
          target: States.Resert,
        },
      },
    },
    [States.Change]: {
      actions: {
        onEnter(fields, instance) {
          instance.setContext((context) => ({
            ...context,
            ...fields,
          }));
          instance.transition("complete");
        },
      },
      transitions: {
        complete: {
          target: States.Idle,
        },
      },
    },
    [States.Resert]: {
      actions: {
        onEnter(_, instance) {
          instance.setContext((context) => ({
            ...context,
            title: "",
          }));
          instance.transition("complete");
        },
      },
      transitions: {
        complete: {
          target: States.Idle,
        },
      },
    },
  },
});
