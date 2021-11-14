export {};

type Test<T> = T extends unknown ? (T extends {} ? true : false) : never;

type IsNever<T> = [T] extends [never] ? true : false;

type Test2 = Test<{} | false>;
