import {useEffect, useReducer} from "../_snowpack/pkg/react.js";
export const useAsyncData = (task) => {
  const [state, dispatch] = useReducer((state2, action) => {
    switch (action.type) {
      case "run":
        return {type: "pending"};
      case "resolve":
        return {type: "ready", data: action.data};
      default:
        return state2;
    }
  }, {type: "idle"});
  useEffect(() => {
    const promise = task();
    dispatch({type: "run"});
    promise.then((a) => dispatch({type: "resolve", data: a}));
  }, []);
  return state;
};
