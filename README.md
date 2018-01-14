[![Build Status](https://travis-ci.org/bitrinjani/awaitable-event-emitter.svg?branch=master)](https://travis-ci.org/bitrinjani/awaitable-event-emitter) [![Coverage Status](https://coveralls.io/repos/github/bitrinjani/awaitable-event-emitter/badge.svg?branch=master&i=2)](https://coveralls.io/github/bitrinjani/awaitable-event-emitter?branch=master) [![npm version](https://badge.fury.io/js/%40bitr%2Fawaitable-event-emitter.svg)](https://badge.fury.io/js/%40bitr%2Fawaitable-event-emitter)

# Awaitable Event Emitter
Awaitable Event Emitter is an enhanced version of node.js EventEmitter. It allows you to await `emit` methods, unlike fire-and-foget `emit` of the native EventEmitter.

# Install

```bash
npm install @bitr/awaitable-event-emitter 
```

# Why do you need this library?

In the native EventEmitter, it is not easy to know when `emit` has finished executing the registered listeners because `emit` returns immediately without waiting for promises. In this enhanced version, you can await `emitParallel`/`emitSerial` that returns Promise.

```typescript
class Awaitable extends AwaitableEventEmitter {
  ...
}

const awaitable = new Awaitable();

// Register async functions that returns Promise.
awaitable.on('event', async () => { ... });
awaitable.on('event', async () => { ... });

// Emit an event, execute listeners in parallel, and await until all listeners have finished. 
await awaitable.emitParallel('event');

// Or execute listeners in serial order
await awaitable.emitSerial('event');
```

# Implementation

`emitParallel` is implemented with Promise.all. 

```typescript
async emitParallel(event: string | symbol, ...args: any[]): Promise<void> {
  ...
  const tasks = listeners.map(l => l.fn(...args))
  await Promise.all(tasks);  
  ...
}
```

`emitSerial` is just a for-loop with await inside.

```typescript
async emitSerial(event: string | symbol, ...args: any[]): Promise<void> {
  for (const listener of listeners) {
    await listener.fn(...args);
  }
} 
```


