import React, { useCallback, useEffect, useRef, useState } from 'react';
import TwoTS from 'twojs-ts';
declare class Two extends TwoTS {}

export const useTwo = <T extends HTMLElement>(
  elRef: React.RefObject<T>,
  f: (two: Two, el: T) => void,
  fDeps: React.DependencyList,
) => {
  const twoRef = useRef<Two>();
  useEffect(() => {
    const el = elRef.current;
    if (!el) {
      return;
    }

    twoRef.current = new Two({
      width: el.clientWidth,
      height: el.clientHeight,
      // autostart: false,
    });
    twoRef.current.appendTo(el);
  }, []);
  useEffect(() => {
    const el = elRef.current;
    if (!el) {
      return;
    }
    if (twoRef.current) {
      return f(twoRef.current, el);
    }
  }, fDeps);
};

type BoolState = {
  setFalse(): void;
  setTrue(): void;
  toggle(): void;
  value: boolean;
};

export const useBoolState = (init: boolean): BoolState => {
  const [value, setValue] = useState(init);
  const setFalse = useCallback(() => {
    setValue(false);
  }, [setValue]);
  const setTrue = useCallback(() => {
    setValue(true);
  }, [setValue]);
  const toggle = useCallback(() => {
    setValue((a) => !a);
  }, [setValue]);
  return {
    setFalse,
    setTrue,
    value,
    toggle,
  };
};

export type PopupState = {
  isOpen: boolean;
  open(): void;
  close(): void;
  toggle(): void;
};

export const usePopupState = (init: boolean): PopupState => {
  const { value, setTrue, setFalse, toggle } = useBoolState(init);

  return {
    isOpen: value,
    open: setTrue,
    close: setFalse,
    toggle,
  };
};
