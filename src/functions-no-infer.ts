export {};
type NoInfer<T> = [T][T extends any ? 0 : never];

const pipe = <A, B, C>(fn1: (arg: A) => B, fn2: (arg: NoInfer<B>) => C) => {
  return (arg: A) => fn2(fn1(arg));
};

let result = pipe(
  (n: number) => n,
  (n: string) => n
);

class Base {
  a = 1;
  handler(object: Base) {}
}

class Child extends Base {
  b = 2;

  handler(object: Child) {}
}
