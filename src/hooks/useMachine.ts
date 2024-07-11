import { useCallback, useSyncExternalStore } from "react";
import type StateMachine from "../fsm/machine";

export const useMachine = <T>(machine: StateMachine<T>) => {
  const getSnapshot = useCallback(() => machine.state, [machine]);
  const subscribe = useCallback(
    (listener: () => void) => machine.subscribe("change", listener).release,
    [machine],
  );
  const send = useCallback(
    (type: string, payload: Record<string, unknown> = {}) => {
      machine.transition(type, payload);
    },
    [machine],
  );

  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  return [state, send] as const;
};
