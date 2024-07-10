import type { StateMachineConfig } from "./machine";
import StateMachine from "./machine";

export const createMachine = <T>(config: StateMachineConfig<T>) => {
  return new StateMachine(config);
};
