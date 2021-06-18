import { pipe } from 'fp-ts/lib/function';
import type IO from 'fp-ts/lib/IO';
import IOE from 'fp-ts/lib/IOEither';
import E from 'fp-ts/lib/Either';
import O from 'fp-ts/lib/Option';
import * as N from 'fp-ts-std/Number';
import * as J from 'fp-ts-std/JSON';

const getItemUnsafe =
  (key: string): IO.IO<O.Option<string>> =>
  () =>
    O.fromNullable(localStorage.getItem(key));

export const getItem = (key: string): IOE.IOEither<Error, O.Option<string>> =>
  pipe(
    IOE.tryCatch(() => localStorage.getItem(key), E.toError),
    IOE.map(O.fromNullable),
  );

const removeItemUnsafe =
  (key: string): IO.IO<void> =>
  () =>
    localStorage.removeItem(key);

export const removeItem = (key: string): IOE.IOEither<Error, void> =>
  IOE.tryCatch(removeItemUnsafe(key), E.toError);

const setItemUnsafe =
  (key: string, value: string): IO.IO<void> =>
  () =>
    localStorage.setItem(key, value);

export const setItem = (
  key: string,
  value: string,
): IOE.IOEither<Error, void> =>
  IOE.tryCatch(setItemUnsafe(key, value), E.toError);

export const getFloat = (key: string): IOE.IOEither<Error, O.Option<number>> =>
  pipe(getItem(key), IOE.map(O.chain(N.floatFromString)));

export const setPrimitive = (
  key: string,
  p: string | number | boolean | null,
): IOE.IOEither<Error, void> =>
  setItem(key, pipe(p, J.stringifyPrimitive, J.unJSONString));
