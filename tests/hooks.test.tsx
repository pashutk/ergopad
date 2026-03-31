import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react-hooks';
import { useBoolState, usePopupState } from '../src/hooks';

describe('useBoolState', () => {
  it('initializes with the given value', () => {
    const { result } = renderHook(() => useBoolState(false));
    expect(result.current.value).toBe(false);
  });

  it('setTrue sets value to true', () => {
    const { result } = renderHook(() => useBoolState(false));
    act(() => result.current.setTrue());
    expect(result.current.value).toBe(true);
  });

  it('setFalse sets value to false', () => {
    const { result } = renderHook(() => useBoolState(true));
    act(() => result.current.setFalse());
    expect(result.current.value).toBe(false);
  });

  it('toggle flips the value', () => {
    const { result } = renderHook(() => useBoolState(false));
    act(() => result.current.toggle());
    expect(result.current.value).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.value).toBe(false);
  });
});

describe('usePopupState', () => {
  it('initializes with the given value', () => {
    const { result } = renderHook(() => usePopupState(false));
    expect(result.current.isOpen).toBe(false);
  });

  it('open sets isOpen to true', () => {
    const { result } = renderHook(() => usePopupState(false));
    act(() => result.current.open());
    expect(result.current.isOpen).toBe(true);
  });

  it('close sets isOpen to false', () => {
    const { result } = renderHook(() => usePopupState(true));
    act(() => result.current.close());
    expect(result.current.isOpen).toBe(false);
  });

  it('toggle flips isOpen', () => {
    const { result } = renderHook(() => usePopupState(false));
    act(() => result.current.toggle());
    expect(result.current.isOpen).toBe(true);
  });
});
