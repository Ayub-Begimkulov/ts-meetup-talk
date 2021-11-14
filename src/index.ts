interface TestInterface {
    a: number;
    b?: TestInterface;
}

type TestInfer<T> = T extends Array<infer U> ? U : never

type Test =ComputeDeep<[TestInterface, 2, TestInterface]>

type ComputeDeep<T, Seen = never> = T extends Seen
    ? T
    : T extends object
    ? T extends (...args: infer Args) => infer Return
        ? (
              ...args: ComputeDeep<Args, Seen | Args>
          ) => ComputeDeep<Return, Seen | Return>
        : {
              [K in keyof T]: ComputeDeep<T[K], Seen | T[K]>;
          } & unknown
    : T;
