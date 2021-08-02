import {useCallback, useEffect, useRef, useState} from "../_snowpack/pkg/react.js";
export const useTwo = (elRef, f, fDeps) => {
  const twoRef = useRef();
  useEffect(() => {
    const el = elRef.current;
    if (!el) {
      return;
    }
    twoRef.current = new Two({
      width: el.clientWidth,
      height: el.clientHeight
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
export const useBoolState = (init) => {
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
    toggle
  };
};
export const usePopupState = (init) => {
  const {value, setTrue, setFalse, toggle} = useBoolState(init);
  return {
    isOpen: value,
    open: setTrue,
    close: setFalse,
    toggle
  };
};
