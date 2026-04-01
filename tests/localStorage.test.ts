import { describe, it, expect, beforeEach, vi } from 'vitest';
import { getItem, getFloat, setPrimitive, removeItem } from '../src/localStorage';
import { unwrapRight, unwrapSome, assertNone } from './helpers';

beforeEach(() => {
  localStorage.clear();
});

describe('getItem', () => {
  it('returns Some(value) for an existing key', () => {
    localStorage.setItem('k', 'hello');
    const result = getItem('k')();
    expect(unwrapSome(unwrapRight(result))).toBe('hello');
  });

  it('returns None for a missing key', () => {
    assertNone(unwrapRight(getItem('missing')()));
  });

  it('returns Left when localStorage throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('quota exceeded');
    });
    expect(getItem('k')()._tag).toBe('Left');
    vi.restoreAllMocks();
  });
});

describe('getFloat', () => {
  it('returns Some(number) for a valid float string', () => {
    localStorage.setItem('k', '3.14');
    expect(unwrapSome(unwrapRight(getFloat('k')()))).toBeCloseTo(3.14);
  });

  it('returns None for a non-numeric string', () => {
    localStorage.setItem('k', 'abc');
    assertNone(unwrapRight(getFloat('k')()));
  });

  it('returns None for a missing key', () => {
    assertNone(unwrapRight(getFloat('missing')()));
  });
});

describe('setPrimitive', () => {
  it('stores a number as its JSON representation', () => {
    setPrimitive('k', 42)();
    expect(localStorage.getItem('k')).toBe('42');
  });

  it('stores a string as its JSON representation', () => {
    setPrimitive('k', 'hello')();
    expect(localStorage.getItem('k')).toBe('"hello"');
  });

  it('stores a boolean', () => {
    setPrimitive('k', true)();
    expect(localStorage.getItem('k')).toBe('true');
  });

  it('stores null', () => {
    setPrimitive('k', null)();
    expect(localStorage.getItem('k')).toBe('null');
  });

  it('round-trips a number through getFloat', () => {
    setPrimitive('k', 5)();
    expect(unwrapSome(unwrapRight(getFloat('k')()))).toBeCloseTo(5);
  });
});

describe('removeItem', () => {
  it('removes an existing key so subsequent reads return None', () => {
    localStorage.setItem('k', 'v');
    removeItem('k')();
    assertNone(unwrapRight(getItem('k')()));
  });
});
