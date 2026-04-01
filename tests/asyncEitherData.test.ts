import { describe, it, expect } from 'vitest';
import * as E from 'fp-ts/lib/Either';
import { renderHook, act } from '@testing-library/react-hooks';
import { fold, useAsyncEitherData } from '../src/asyncEitherData';

describe('fold', () => {
  const f = fold(
    () => 'idle' as const,
    () => 'pending' as const,
    (e: string) => `failed:${e}` as const,
    (a: number) => `ready:${a}` as const,
  );

  it('calls onIdle for idle state', () => {
    expect(f({ type: 'idle' })).toBe('idle');
  });

  it('calls onPending for pending state', () => {
    expect(f({ type: 'pending' })).toBe('pending');
  });

  it('calls onFailed with reason for failed state', () => {
    expect(f({ type: 'failed', reason: 'oops' })).toBe('failed:oops');
  });

  it('calls onReady with data for ready state', () => {
    expect(f({ type: 'ready', data: 42 })).toBe('ready:42');
  });
});

describe('useAsyncEitherData', () => {
  // useEffect fires and is flushed within renderHook's act, so the hook is
  // already in 'pending' state by the time the test body runs.

  it('resolves to ready for Right', async () => {
    type R = E.Either<Error, number>;
    let resolveTask!: (v: R) => void;
    const te = () => new Promise<R>((res) => { resolveTask = res; });

    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncEitherData(te),
    );
    expect(result.current.type).toBe('pending');

    act(() => resolveTask(E.right(42)));
    await waitForNextUpdate(); // pending → ready
    expect(result.current.type).toBe('ready');
    if (result.current.type === 'ready') {
      expect(result.current.data).toBe(42);
    }
  });

  it('resolves to failed for Left', async () => {
    type R = E.Either<Error, number>;
    let resolveTask!: (v: R) => void;
    const te = () => new Promise<R>((res) => { resolveTask = res; });

    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncEitherData(te),
    );
    expect(result.current.type).toBe('pending');

    act(() => resolveTask(E.left(new Error('oops'))));
    await waitForNextUpdate(); // pending → failed
    expect(result.current.type).toBe('failed');
    if (result.current.type === 'failed') {
      expect(result.current.reason).toBeInstanceOf(Error);
    }
  });
});
