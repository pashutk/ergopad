import type { Either } from 'fp-ts/lib/Either';
import type { Option } from 'fp-ts/lib/Option';

// These helpers extract values from fp-ts containers without leaking _tag
// checks into every test. When fp-ts is removed, only these helpers change —
// the expect() assertions in each test stay the same.

export function unwrapRight<E, A>(result: Either<E, A>): A {
  if (result._tag !== 'Right')
    throw new Error(
      `Expected Right, got Left: ${JSON.stringify((result as any).left)}`,
    );
  return (result as any).right;
}

export function unwrapLeft<E, A>(result: Either<E, A>): E {
  if (result._tag !== 'Left') throw new Error('Expected Left, got Right');
  return (result as any).left;
}

export function unwrapSome<A>(opt: Option<A>): A {
  if (opt._tag !== 'Some')
    throw new Error('Expected Some, got None');
  return (opt as any).value;
}

export function assertNone<A>(opt: Option<A>): void {
  if (opt._tag !== 'None')
    throw new Error(
      `Expected None, got Some: ${JSON.stringify((opt as any).value)}`,
    );
}
