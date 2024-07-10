import { useCallback, useSyncExternalStore } from "react";
import type StateMachine from "../fsm/machine";

export const useMachine = <T>(machine: StateMachine<T>) => {
  const getContext = useCallback(() => machine.getContext(), [machine]);
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

  const state = useSyncExternalStore(subscribe, getContext, getContext);

  return [state, send] as const;
};
