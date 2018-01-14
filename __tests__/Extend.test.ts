import AwaitableEventEmitter from '../src/AwaitableEventEmitter';
import { EventEmitter } from 'events';

function delay(time: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time));
}

class AwaitableParallel extends AwaitableEventEmitter {
  constructor(private readonly field1, private readonly field2) {
    super();
  }

  async do(parallel: boolean) {
    if (parallel) {
      await this.emitParallel('event', this.field1, this.field2);
    } else {
      await this.emitSerial('event', this.field1, this.field2);
    }
  }

  private async log(s: string) {
    await delay(10);
    console.log(s);
  }
}

class NotAwaitable extends EventEmitter {
  constructor(private readonly field1, private readonly field2) {
    super();
  }

  async do() {
    this.emit('event', this.field1, this.field2);
  }

  private async log(s: string) {
    await delay(10);
    console.log(s);
  }
}

test('extend Awaitable parallel', async () => {  
  console.log('Awaitable Parallel');
  const o = new AwaitableParallel(1, 2);
  o.on('event', async (f1, f2) => {
    console.log('[First event] handler start');
    await delay(10);
    console.log(`[First event] f1: ${f1}, f2: ${f2}`);
    console.log('[First event] handler end');
  });
  o.on('event', async (f1, f2) => {
    console.log('[Second event] handler start');
    await delay(10);
    console.log(`[Second event] f1: ${f1}, f2: ${f2}`);
    console.log('[Second event] handler end');
  });
  console.log('before calling do');
  await o.do(true);
  console.log('after calling do');
});

test('extend Awaitable serial', async () => {
  console.log('Awaitable Serial');
  const o = new AwaitableParallel(1, 2);
  o.on('event', async (f1, f2) => {
    console.log('[First event] handler start');
    await delay(10);
    console.log(`[First event] f1: ${f1}, f2: ${f2}`);
    console.log('[First event] handler end');
  });
  o.on('event', async (f1, f2) => {
    console.log('[Second event] handler start');
    await delay(10);
    console.log(`[Second event] f1: ${f1}, f2: ${f2}`);
    console.log('[Second event] handler end');
  });
  console.log('before calling do');
  await o.do(false);
  console.log('after calling do');
});

test('extend normal EventEmitter', async () => {
  console.log('Normal EventEmitter');
  const o = new NotAwaitable(1, 2);
  o.on('event', async (f1, f2) => {
    console.log('[First event] handler start');
    await delay(10);
    console.log(`[First event] f1: ${f1}, f2: ${f2}`);
    console.log('[First event] handler end');
  });
  o.on('event', async (f1, f2) => {
    console.log('[Second event] handler start');
    await delay(10);
    console.log(`[Second event] f1: ${f1}, f2: ${f2}`);
    console.log('[Second event] handler end');
  });
  console.log('before calling do');
  await o.do();
  console.log('after calling do');
  await delay(50);
});
