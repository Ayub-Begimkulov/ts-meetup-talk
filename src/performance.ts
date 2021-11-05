type Optional<T> = {
  [K in keyof T]?: T[K];
} & {};

type Hello = Optional<{ a: number }>;
