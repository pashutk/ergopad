import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useAsyncData } from '../src/asyncData';

// Like useAsyncEitherData, the useEffect fires and flushes inside renderHook's
// act, so the hook is already 'pending' by the time the test body starts.

describe('useAsyncData', () => {
  it('starts in pending state after mount', () => {
    const te = () => new Promise<string>(() => {}); // never resolves
    const { result } = renderHook(() => useAsyncData(te));
    expect(result.current.type).toBe('pending');
  });

  it('transitions to ready when the task resolves', async () => {
    let resolve!: (v: string) => void;
    const task = () => new Promise<string>((res) => { resolve = res; });

    const { result, waitForNextUpdate } = renderHook(() => useAsyncData(task));
    expect(result.current.type).toBe('pending');

    act(() => resolve('hello'));
    await waitForNextUpdate(); // pending → ready
    expect(result.current.type).toBe('ready');
    if (result.current.type === 'ready') {
      expect(result.current.data).toBe('hello');
    }
  });
});
