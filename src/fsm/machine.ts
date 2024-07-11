import { EventEmitter } from "./event-emitter";

type Transition<TContext> = {
  target: string;
  action?: (instance: StateMachine<TContext>) => void;
};

type Actions<TContext> = {
  onEnter?: (
    params: Record<string, unknown>,
    instance: StateMachine<TContext>,
  ) => void;
  onExit?: (instance: StateMachine<TContext>) => void;
};

type State<TContext> = {
  actions?: Actions<TContext>;
  transitions: Record<string, Transition<TContext>>;
};

export type StateMachineConfig<TContext> = {
  initialState: string;
  states: Record<string, State<TContext>>;
  context: TContext;
};

export default class StateMachine<TContext = object> extends EventEmitter {
  state: {
    value: string;
    context: TContext;
  };
  states: Record<string, State<TContext>>;
  context: TContext;

  constructor(config: StateMachineConfig<TContext>) {
    super();
    this.state = {
      value: config.initialState,
      context: config.context,
    };
    this.states = config.states;
    this.context = config.context;
  }

  setContext(context: TContext | ((context: TContext) => TContext)) {
    if (typeof context === "function") {
      this.state = {
        ...this.state,
        // @ts-expect-error: context cannot be used as a function, will fix later
        context: context(this.state.context),
      };
    } else {
      this.state = {
        ...this.state,
        context: context,
      };
    }
  }

  transition(eventName: string, params: Record<string, unknown> = {}) {
    const currentState = this.states[this.state.value];
    const transition = currentState.transitions[eventName];
    if (!transition) {
      return;
    }

    this.state = {
      ...this.state,
      value: transition.target,
    };

    transition.action?.(this);
    currentState.actions?.onExit?.(this);
    this.states[this.state.value].actions?.onEnter?.(params, this);

    this.emit("change");
  }
}
