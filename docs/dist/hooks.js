import {useEffect, useRef} from "../_snowpack/pkg/react.js";
export const useTwo = (elRef, f, fDeps) => {
  const twoRef = useRef();
  useEffect(() => {
    const el = elRef.current;
    if (!el) {
      return;
    }
    const params = {
      width: el.clientWidth,
      height: el.clientHeight
    };
    twoRef.current = new Two(params);
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