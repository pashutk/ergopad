import { useEffect, useReducer } from 'react';
import type T from 'fp-ts/lib/Task';

export type AsyncData<A> =
  | {
      type: 'idle';
    }
  | {
      type: 'pending';
    }
  | {
      type: 'ready';
      data: A;
    };

export type Action<A> = { type: 'run' } | { type: 'resolve'; data: A };

export const useAsyncData = <A>(task: T.Task<A>): AsyncData<A> => {
  const [state, dispatch] = useReducer(
    (state: AsyncData<A>, action: Action<A>): AsyncData<A> => {
      switch (action.type) {
        case 'run':
          return { type: 'pending' };
        case 'resolve':
          return { type: 'ready', data: action.data };
        default:
          return state;
      }
    },
    { type: 'idle' },
  );
  useEffect(() => {
    const promise = task();
    dispatch({ type: 'run' });
    promise.then((a) => dispatch({ type: 'resolve', data: a }));
  }, []);
  return state;
};
