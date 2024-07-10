export class EventEmitter {
  events: Record<string, Record<string, Function>>;
  count: number;

  constructor() {
    this.events = {};
    this.count = 0;
  }

  subscribe(eventName: string, callback: Function) {
    const id = this.count++;
    if (!this.events[eventName]) {
      this.events[eventName] = {};
    }

    this.events[eventName][id] = callback;

    return {
      release: () => {
        delete this.events[eventName][id];
      },
    };
  }

  emit(eventName: string, ...args: unknown[]) {
    const listeners = this.events[eventName];
    if (listeners) {
      for (let id in listeners) {
        listeners[id](...args);
      }
    }
  }
}
