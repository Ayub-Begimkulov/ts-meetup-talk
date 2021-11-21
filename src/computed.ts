export {};

interface SomeInterface {
  a: number;
  b: symbol;
  c: SomeSubInterface2;
  world: SomeSubInterface;
};

interface SomeSubInterface {
  d: number;
  f: (arg: SomeSubInterface2, arg2: SomeSubInterface2) => void;
  toString: () => string;
}

interface SomeSubInterface2 {
  d: string;
}

export declare function doSomething(options: object): SomeInterface;

const result = doSomething({ option: true });

/* simple version of the compute */
type Compute<T extends object> = {
  [K in keyof T]: T[K]
} & unknown;

type SomeInfiniteRecursion<T> = {
  [K in keyof T]: SomeInfiniteRecursion<T[K]>
} & unknown;


type ActualType = Compute<typeof result>;

type ComputeDeep<T> =
  T extends (...args: infer Args) => infer Return
  ? (...args: ComputeDeep<Args>) => ComputeDeep<Return>
  : T extends object
  ? {
    [K in keyof T]: ComputeDeep<T[K]>;
  } & unknown
  : T;

type LiteralType = ComputeDeep<SomeInterface>;
