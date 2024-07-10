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
  state: string;
  states: Record<string, State<TContext>>;
  context: TContext;

  constructor(config: StateMachineConfig<TContext>) {
    super();
    this.state = config.initialState;
    this.states = config.states;
    this.context = config.context;
  }

  getContext() {
    return this.context;
  }

  // function useState<S = undefined>(): [S | undefined, Dispatch<SetStateAction<S | undefined>>];

  setContext(context: TContext | ((a: TContext) => TContext)) {
    if (typeof context === "function") {
      // @ts-expect-error: context cannot be used as a function, will fix later
      this.context = context(this.context);
    } else {
      this.context = context;
    }
  }

  transition(eventName: string, params: Record<string, unknown> = {}) {
    const currentState = this.states[this.state];
    const transition = currentState.transitions[eventName];
    if (!transition) {
      return;
    }

    this.state = transition.target;

    const newState = this.states[this.state];

    transition.action?.(this);
    currentState.actions?.onExit?.(this);
    newState.actions?.onEnter?.(params, this);

    this.emit("change");
  }
}
