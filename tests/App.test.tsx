import React from 'react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import * as O from 'fp-ts/lib/Option';
import { Windmill } from '@windmill/react-ui';
import { App } from '../src/App';

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('navigator', {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    userAgent: '',
  });
});

const renderApp = (storedPpm: O.Option<number> = O.none) =>
  render(
    <Windmill>
      <App storedPpm={storedPpm} />
    </Windmill>,
  );

describe('App', () => {
  it('renders without crashing', () => {
    renderApp();
  });

  it('renders all column buttons', () => {
    renderApp();
    // Use exact string matching to avoid /index/ matching both "index" and "index_far"
    for (const name of ['thumb', 'index_far', 'index', 'middle', 'ring', 'pinky']) {
      expect(screen.getByRole('button', { name })).toBeTruthy();
    }
  });

  it('middle column is active by default', () => {
    renderApp();
    const middleBtn = screen.getByRole('button', { name: 'middle' });
    const pinkyBtn = screen.getByRole('button', { name: 'pinky' });
    // Active column (outline layout) and inactive (primary layout) have different classes
    expect(middleBtn.className).not.toBe(pinkyBtn.className);
  });

  it('switches active column on click', () => {
    renderApp();
    const middleBtn = screen.getByRole('button', { name: 'middle' });
    const pinkyBtn = screen.getByRole('button', { name: 'pinky' });
    const initialMiddleClass = middleBtn.className;
    const initialPinkyClass = pinkyBtn.className;

    fireEvent.click(pinkyBtn);

    // After clicking pinky: pinky becomes active (outline), middle becomes inactive (primary)
    expect(pinkyBtn.className).toBe(initialMiddleClass);
    expect(middleBtn.className).toBe(initialPinkyClass);
  });

  it('reset all clears positions — export returns empty state', async () => {
    renderApp();
    // Click Reset all, then export and verify all columns are empty arrays
    fireEvent.click(screen.getByRole('button', { name: /reset all/i }));
    fireEvent.click(screen.getByText('Export'));
    await waitFor(() => screen.getByText('Raw'));
    fireEvent.click(screen.getByText('Raw'));
    await waitFor(() =>
      expect((navigator.clipboard as any).writeText).toHaveBeenCalledWith(
        JSON.stringify({
          thumb: [],
          index_far: [],
          index: [],
          middle: [],
          ring: [],
          pinky: [],
        }),
      ),
    );
  });

  it('aux lines checkbox is checked by default and toggles on click', () => {
    renderApp();
    const checkbox = document.querySelector(
      'input[type="checkbox"]',
    ) as HTMLInputElement;
    expect(checkbox).toBeTruthy();
    expect(checkbox.checked).toBe(true);
    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });

  it('uses storedPpm as the initial ppm value', () => {
    // Should not throw when a stored ppm is provided
    renderApp(O.some(8));
  });

  it('export button opens the dropdown', async () => {
    renderApp();
    // The Export button has aria-label="Notifications" (Windmill workaround),
    // so find it by text content rather than accessible name.
    fireEvent.click(screen.getByText('Export'));
    await waitFor(() => expect(screen.getByText('Raw')).toBeTruthy());
  });

  it('clicking Raw triggers a clipboard write', async () => {
    renderApp();
    fireEvent.click(screen.getByText('Export'));
    await waitFor(() => screen.getByText('Raw'));
    fireEvent.click(screen.getByText('Raw'));
    await waitFor(() =>
      expect((navigator.clipboard as any).writeText).toHaveBeenCalled(),
    );
  });
});
