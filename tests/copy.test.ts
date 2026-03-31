import { describe, it, expect, vi, afterEach } from 'vitest';
import { copy } from '../src/copy';

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('copy', () => {
  it('uses navigator.clipboard.writeText when available', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal('navigator', { clipboard: { writeText }, userAgent: '' });
    await copy('hello');
    expect(writeText).toHaveBeenCalledWith('hello');
  });

  it('falls back to execCommand when clipboard is unavailable', async () => {
    vi.stubGlobal('navigator', { clipboard: undefined, userAgent: '' });
    document.execCommand = vi.fn().mockReturnValue(true);
    await copy('hello');
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });
});
