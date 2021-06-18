import * as E from 'fp-ts/lib/Either';
import { absurd } from 'fp-ts/lib/function';
import type TE from 'fp-ts/lib/TaskEither';
import { useEffect, useReducer } from 'react';
import type { Action as AsyncAction, AsyncData } from './asyncData';

type AsyncEitherData<E, A> = AsyncData<A> | { type: 'failed'; reason: E };

type Action<E, A> = AsyncAction<A> | { type: 'reject'; reason: E };

export const fold =
  <E, A, B>(
    onIdle: () => B,
    onPending: () => B,
    onFailed: (e: E) => B,
    onReady: (a: A) => B,
  ) =>
  (aed: AsyncEitherData<E, A>): B => {
    switch (aed.type) {
      case 'idle':
        return onIdle();
      case 'pending':
        return onPending();
      case 'failed':
        return onFailed(aed.reason);
      case 'ready':
        return onReady(aed.data);
      default:
        return absurd(aed);
    }
  };

export const useAsyncEitherData = <E, A>(
  te: TE.TaskEither<E, A>,
): AsyncEitherData<E, A> => {
  const [state, dispatch] = useReducer(
    (
      state: AsyncEitherData<E, A>,
      action: Action<E, A>,
    ): AsyncEitherData<E, A> => {
      switch (action.type) {
        case 'run':
          return { type: 'pending' };
        case 'resolve':
          return { type: 'ready', data: action.data };
        case 'reject':
          return { type: 'failed', reason: action.reason };
        default:
          return state;
      }
    },
    { type: 'idle' },
  );
  useEffect(() => {
    const promise = te();
    dispatch({ type: 'run' });
    promise.then(
      E.fold(
        (e) => dispatch({ type: 'reject', reason: e }),
        (a) => dispatch({ type: 'resolve', data: a }),
      ),
    );
  }, []);
  return state;
};
