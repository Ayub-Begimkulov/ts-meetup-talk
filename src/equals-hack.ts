export {};

// simple test
declare const assert: <T extends boolean>(value: T) => void;

// prettier-ignore
type Equals<A, B> =
  (<T>() => T extends A ? 1 : 0) extends (<T>() => T extends B ? 1 : 0)
  ? true
  : false;

declare const uniqId: unique symbol;
type ERROR = 'ERROR' & { [uniqId]: never; };

type IsNull<T> = Equals<T, null>;
type IsNumber<T> = Equals<T, number>;
type IsString<T> = Equals<T, string>;

type Not<T extends boolean> = T extends true ? false : true;

type AssertArguments<A, B> = Equals<A, B> extends true ? [] : [ERROR];

type Assertions<Actual, Truthiness extends boolean = true> = {
  // it firstly matches the 2nd overload, then after we return [never]
  // it will match the first one and give an error
  toEqual: {
    <Expected>(...rest: AssertArguments<Equals<Actual, Expected>, Truthiness>): void;
    <Expected>(value: Expected, ...rest: AssertArguments<Equals<Actual, Expected>, Truthiness>): void;
  };
  toBeNull(...args: AssertArguments<IsNull<Actual>, Truthiness>): void;
  toBeNumber(...args: AssertArguments<IsNumber<Actual>, Truthiness>): void;
  toBeString(...args: AssertArguments<IsString<Actual>, Truthiness>): void;
  not: Assertions<Actual, Not<Truthiness>>;
};

declare const expect: <T>(value?: T) => Assertions<T>;

expect(1).toEqual<number>();
// @ts-expect-error
expect(1).not.toBeNumber();

expect<number>().not.toBeNull();
