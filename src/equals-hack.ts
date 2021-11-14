export {};

type CommonEquals<A, B> = B extends unknown
  ? A extends B
    ? true
    : false
  : never;

type Test5 = Equals<unknown, any>;

// prettier-ignore
type Equals<A, B> = 
  (<T>() => T extends A ? 1 : 0) extends (<T>() => T extends B ? 1: 0)
    ? true
    : false;

type OmitTest = Equals<Omit<{ a: number; b: string }, 'b'>, { a: number }>;

declare const uniqId: unique symbol;
type ERROR = 'ERROR' & { [uniqId]: never };

type Test = Equals<any, number>;
type IsNull<T> = Equals<T, null>;

type AssertArguments<A, B> = Equals<A, B> extends true ? [] : [ERROR];

type Assertions<T> = {
  // it firstly matches the 2nd overload, then after we return [never]
  // it will match the first one and give an error
  toEqual: {
    <A>(...rest: AssertArguments<Equals<T, A>, true>): void;
    <A>(value: A, ...rest: AssertArguments<Equals<T, A>, true>): void;
  };
  toBeNull(...args: AssertArguments<IsNull<T>, true>): void;
};

declare const expect: <T>(value: T) => Assertions<T>;

expect(1).toEqual<number>();

type Test2 = 5 extends never ? true : false;
