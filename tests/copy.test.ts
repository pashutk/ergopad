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

  it('uses iOS selection API on iOS devices', async () => {
    vi.stubGlobal('navigator', {
      clipboard: undefined,
      userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
    });
    document.execCommand = vi.fn().mockReturnValue(true);
    const mockSelection = { removeAllRanges: vi.fn(), addRange: vi.fn() };
    vi.spyOn(window, 'getSelection').mockReturnValue(mockSelection as any);

    await copy('hello');

    // iOS path uses createRange + setSelectionRange instead of .select()
    expect(mockSelection.removeAllRanges).toHaveBeenCalled();
    expect(mockSelection.addRange).toHaveBeenCalled();
    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });
});
