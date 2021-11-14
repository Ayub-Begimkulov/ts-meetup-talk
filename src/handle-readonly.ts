const map = <T, R>(arr: readonly T[], fn: (val: T) => R): R[] => {
  return arr.map(fn);
};

const myArray = [1, 2, 3, 4] as const;

interface ConfigType {
  env: 'test' | 'prod' | 'dev';
  arr: readonly number[];
}

const config = {
  env: 'test',
  arr: [1, 2, 3],
} as const;

let a: ConfigType = config;

let result = map(config.arr, v => v.toString());

type Entries<TObject> = {
  [K in keyof TObject]: [K, TObject[K]];
}[keyof TObject];

type SomeTest = Entries<{ a: number; b: string; c?: any }>;

type Union = 'a' | 'b' | 'c';
