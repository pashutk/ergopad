import * as E from "../_snowpack/pkg/fp-ts/lib/Either.js";
import {absurd} from "../_snowpack/pkg/fp-ts/lib/function.js";
import {useEffect, useReducer} from "../_snowpack/pkg/react.js";
export const fold = (onIdle, onPending, onFailed, onReady) => (aed) => {
  switch (aed.type) {
    case "idle":
      return onIdle();
    case "pending":
      return onPending();
    case "failed":
      return onFailed(aed.reason);
    case "ready":
      return onReady(aed.data);
    default:
      return absurd(aed);
  }
};
export const useAsyncEitherData = (te) => {
  const [state, dispatch] = useReducer((state2, action) => {
    switch (action.type) {
      case "run":
        return {type: "pending"};
      case "resolve":
        return {type: "ready", data: action.data};
      case "reject":
        return {type: "failed", reason: action.reason};
      default:
        return state2;
    }
  }, {type: "idle"});
  useEffect(() => {
    const promise = te();
    dispatch({type: "run"});
    promise.then(E.fold((e) => dispatch({type: "reject", reason: e}), (a) => dispatch({type: "resolve", data: a})));
  }, []);
  return state;
};
