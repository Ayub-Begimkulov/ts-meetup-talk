export {};

type Test<T> = T extends unknown ? (T extends {} ? true : false) : never;

type IsNever<T> = [T] extends [never] ? true : false;

type Test2 = Test<{} | false>;

type Recursive<T> = ({
    [K in keyof T]: Recursive<T>
} & unknown) extends infer X ? X : never;


type PartialTest = Partial<{ a: number; } | { b: string; }>;

let a: string;

declare const b: string | number;

// @ts-expect-error
a = b;

type FunctionKeys<TObject extends object> = {
    [Key in keyof TObject]: TObject[Key] extends (...args: any[]) => any ? Key : never;
}[keyof TObject];

type FunctionKeysTest = FunctionKeys<{ a: number, b: string; c(): void; d(): number; }>;

type HasKey<TObject extends object, Key extends string> = keyof TObject extends Key ? true : false;

type HasKeyTest = HasKey<{ a: number; } | { b: string; }, 'a'>;


type CallFunctions<TObject extends Record<string, () => any>> = {
    [Key in keyof TObject]: ReturnType<TObject[Key]>;
};

type CallFunctionsTest = CallFunctions<{ a(): number, b(): string; }>;


type IsArrayLike<T extends Record<string, any>> = T['length'] extends number
    ? true
    : false;

type IsArrayLikeTest = IsArrayLike<{ length: 5; } | { prop: 'prop'; }>;
