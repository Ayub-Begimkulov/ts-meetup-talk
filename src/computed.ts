// TODO
// add examples where compute doesn't work without `& unknown`
export {};

interface World {
  d: number;
  f: (arg: D, arg2: D) => D;
  toString: () => string;
}

interface D {
  d: string;
}

type Hello<T> = {
  a: number;
  b: T;
  c: D;
  world: Omit<World, 'a'>;
} & Partial<{ a: number; l: string }>;

type AnyFunction = (...args: any[]) => any;

type ComputeDeep<T> = T extends AnyFunction
  ? (...args: ComputeDeep<Parameters<T>>) => ComputeDeep<ReturnType<T>>
  : T extends object
  ? {
      [K in keyof T]: ComputeDeep<T[K]>;
    } & unknown
  : T;

type LiteralType = ComputeDeep<Hello<symbol>>;
