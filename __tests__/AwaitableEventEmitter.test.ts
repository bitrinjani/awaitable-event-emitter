import AwaitableEventEmitter from '../src/AwaitableEventEmitter';

describe('AwaitableEventEmitter', () => {
  test('parallel', async () => {
    const target = new AwaitableEventEmitter();
    let val = 0;
    const handler = async () => {
      val = 1;
      return;
    };
    target.on('event', handler);
    await target.emitParallel('event');
    expect(val).toBe(1);
  });

  test('parallel multiple handlers', async () => {
    const target = new AwaitableEventEmitter();
    let val = 0;
    let val2 = 0;
    const handler = async () => {
      val = 1;
      return;
    };
    const handler2 = async () => {
      val2 = 2;
      return;
    };
    target.on('event', handler);
    target.on('event', handler2);
    await target.emitParallel('event');
    expect(val).toBe(1);
    expect(val2).toBe(2);
  });

  test('parallel with args', async () => {
    const target = new AwaitableEventEmitter();
    let val = 0;
    const handler = async (a, b) => {
      val = a - b;
      return;
    };
    target.on('event', handler);
    await target.emitParallel('event', 100, 90);
    expect(val).toBe(10);
    await target.emitParallel('event', 120, 90);
    expect(val).toBe(30);
  });

  test('parallel once with args', async () => {
    const target = new AwaitableEventEmitter();
    let val = 0;
    const handler = async (a, b) => {
      val = a - b;
      return;
    };
    target.once('event', handler);
    await target.emitParallel('event', 100, 90);
    expect(val).toBe(10);
    await target.emitParallel('event', 120, 90);
    expect(val).toBe(10);
  });

  test('parallel with args, remove listener', async () => {
    const target = new AwaitableEventEmitter();
    let val = 0;
    const handler = async (a, b) => {
      val = a - b;
      return;
    };
    target.on('event', handler);
    await target.emitParallel('event', 100, 90);
    expect(val).toBe(10);
    target.removeListener('event', handler);
    await target.emitParallel('event', 120, 90);
    expect(val).toBe(10);
  });

  test('parallel with args, remove listener twice', async () => {
    const target = new AwaitableEventEmitter();
    let val = 0;
    const handler = async (a, b) => {
      val = a - b;
      return;
    };
    target.on('event', handler);
    await target.emitParallel('event', 100, 90);
    expect(val).toBe(10);
    target.removeListener('event', handler);
    target.removeListener('event', handler);
    await target.emitParallel('event', 120, 90);
    expect(val).toBe(10);
  });

  test('parallel with args, remove invalid listener', async () => {
    const target = new AwaitableEventEmitter();
    let val = 0;
    const handler = async (a, b) => {
      val = a - b;
      return;
    };
    target.on('event', handler);
    await target.emitParallel('event', 100, 90);
    expect(val).toBe(10);    
    target.removeListener('event', async () => { return; });
    await target.emitParallel('event', 120, 90);
    expect(val).toBe(30);
  });

  test('serial', async () => {
    const target = new AwaitableEventEmitter();
    let val = 0;
    const handler = async () => {
      val = 1;
      return;
    };
    target.on('event', handler);
    await target.emitSerial('event');
    expect(val).toBe(1);
  });

  test('serial with args', async () => {
    const target = new AwaitableEventEmitter();
    let val = 0;
    const handler = async (a, b) => {
      val = a - b;
      return;
    };
    target.on('event', handler);
    await target.emitSerial('event', 100, 90);
    expect(val).toBe(10);
  });

  test('serial with args, remove listener', async () => {
    const target = new AwaitableEventEmitter();
    let val = 0;
    const handler = async (a, b) => {
      val = a - b;
      return;
    };
    target.on('event', handler);
    await target.emitSerial('event', 100, 90);
    expect(val).toBe(10);
    expect(target.listenerCount('event')).toBe(1);
    target.removeListener('event', handler);
    await target.emitSerial('event', 120, 90);
    expect(val).toBe(10);    
    expect(target.listenerCount('event')).toBe(0);
  });

  test('count invalid listener', async () => {
    const target = new AwaitableEventEmitter();
    expect(target.listenerCount('sth')).toBe(0);
  });
});
