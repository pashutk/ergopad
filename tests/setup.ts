import { vi } from 'vitest';

// jsdom doesn't implement matchMedia — stub it so react-hot-toast doesn't warn.
vi.stubGlobal(
  'matchMedia',
  vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
);

// Two.js requires a real canvas — jsdom has none. Mock the global so any
// file importing hooks.ts or App.tsx can be loaded in the test environment.
// Arrow functions cannot be called with `new`, so we use a regular function.
// When a constructor returns an object explicitly, `new` uses that object.
vi.stubGlobal(
  'Two',
  vi.fn().mockImplementation(function () {
    return {
      appendTo: vi.fn(),
      makeCircle: vi.fn(() => ({ linewidth: 0, fill: '', opacity: 1 })),
      makeLine: vi.fn(() => ({ stroke: '', opacity: 1 })),
      makeRectangle: vi.fn(() => ({
        stroke: '',
        linewidth: 0,
        fill: '',
        opacity: 1,
      })),
      makeGroup: vi.fn(() => ({ translation: { set: vi.fn() }, rotation: 0 })),
      update: vi.fn(),
      clear: vi.fn(),
    };
  }),
);
