import * as _ from 'lodash';

export type AsyncListener = (...args: any[]) => Promise<void>;
export interface AsyncListenerContainer {
  fn: AsyncListener;
  once: boolean;
}

export default class AwaitableEventEmitter {
  private events: Map<string | symbol, AsyncListenerContainer[]> = new Map();

  on(event: string | symbol, listener: AsyncListener, once: boolean = false): this {
    const listeners = this.events.has(event) ? (this.events.get(event) as AsyncListenerContainer[]) : [];
    listeners.push({ fn: listener, once });
    this.events.set(event, listeners);
    return this;
  }

  once(event: string | symbol, listener: AsyncListener): this {
    return this.on(event, listener, true);
  }

  removeListener(event: string | symbol, listener: AsyncListener): this {
    const listeners = this.events.get(event);
    if (listeners && listeners.length !== 0) {
      const i = _.findLastIndex(listeners, l => l.fn === listener);
      if (i !== -1) {
        listeners.splice(i, 1);
      }
    }
    return this;
  }

  listenerCount(event: string | symbol): number {
    const listeners = this.events.get(event);
    return listeners === undefined ? 0 : listeners.length;
  }

  async emitParallel(event: string | symbol, ...args: any[]): Promise<void> {
    const listeners = this.events.get(event);
    if (listeners && listeners.length !== 0) {
      const newListeners = listeners.filter(l => !l.once);
      this.events.set(event, newListeners);
      const tasks = listeners.map(l => l.fn(...args))
      await Promise.all(tasks);      
    }       
  }

  async emitSerial(event: string | symbol, ...args: any[]): Promise<void> {
    const listeners = this.events.get(event);
    if (listeners && listeners.length !== 0) {
      const newListeners = listeners.filter(l => !l.once);
      this.events.set(event, newListeners);
      for (const listener of listeners) {
        await listener.fn(...args);
      }
    }
  } 
}
