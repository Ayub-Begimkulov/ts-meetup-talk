https://github.com/millsp/ts-toolbelt/discussions/264
https://github.com/millsp/ts-toolbelt/blob/master/sources/Any/Compute.ts
https://github.com/millsp/ts-toolbelt/blob/master/sources/index.ts
https://github.com/sindresorhus/type-fest
https://stackoverflow.com/questions/53957170/how-do-i-view-large-typescript-types-in-vscode
https://stackoverflow.com/questions/58565584/how-can-i-see-how-typescript-computes-types
https://github.com/mmkal/ts/blob/main/packages/expect-type/src/index.ts
https://github.com/millsp/ts-toolbelt/blob/319e55123b9571d49f34eca3e5926e41ca73e0f3/sources/Any/Compute.ts
https://stackoverflow.com/questions/57683303/how-can-i-see-the-full-expanded-contract-of-a-typescript-type
https://stackoverflow.com/questions/62508909/vs-code-how-to-show-full-typescript-definition-on-mouse-hover?noredirect=1#comment110551926_62508909

-   compute type for debugging
-   vscode don't shorten the output size

Всем привет!

Меня зовут Айюб, я фронтенд разработчик в Вики и Формах.

Сегодня хотел бы рассказать про полезные фичи TS, с которыми мало кто знаком, но часто бывают полезны (особенно при написании библиотек).

Давайте начнем, будем идти от простого к сложному.

## Расширение ошибок

При работе с большими объектами и рекурсивными типами, часто можно наткунться на очень большую ошибку.

Однако TypeScript и подсказки в редакторе обычно сокращают их до определенной длины.

Наверника каждый из вас сталкивался с подобной ошибкой:

```ts
declare const x: {
    propertyWithAnExceedinglyLongName1: string;
    propertyWithAnExceedinglyLongName2: string;
    propertyWithAnExceedinglyLongName3: string;
    propertyWithAnExceedinglyLongName4: string;
    propertyWithAnExceedinglyLongName5: string;
    propertyWithAnExceedinglyLongName6: string;
    propertyWithAnExceedinglyLongName7: string;
    propertyWithAnExceedinglyLongName8: string;
    propertyWithAnExceedinglyLongName9: string;
    propertyWithAnExceedinglyLongName10: string;
    propertyWithAnExceedinglyLongName11: string;
    propertyWithAnExceedinglyLongName12: string;
};

// String representation of type of 'x' should be truncated in error message
var s: string = x;
```

<img src="src/images/ts-turnicated-error.png"/>

Решить эту проблему можно с помощью конфигурации в `tsconfig.json`:

```json
{
    "compilerOptions": {
        // ...
        // other options
        // ...

        "noErrorTruncation": true
    }
}
```

После этого ошибка будет видна в полном виде (из-за скролла ее не видно полностью на скрине):

<img src="src/images/ts-full-error.png"/>

Также стоит отметить, что при включении данной опции, будет раскрываться не только ошибки, но и любые длинные типы.

<!-- TODO стоит ли добавлять про лишнюю нагрузку на компилятор? -->
<!-- TODO стоит ли добавлять про костыль редактирование ts server'а -->

## Раскрытие типов

Продолжая наш разговор про просмотр типов...

Помимо не полного показа типов, также часто можно столкнуться с проблемой, когда TS показывает тип по его алиасу (имя интерфейса, типа).

Это бывает очень полезно при использовании и написании сторонних библиотек со сложной типизацией.

Например, давайте рассмотрим пример с вот такой вот функцией:

```ts
// some-library.ts
interface BigInterface {
    a: number;
    b: OtherBigInterface;
    // ... a lot of the props
}

interface OtherBigInterface {
    // ... a lot of the props
}

export declare const data: BigInterface;

// your-file.ts
import { data } from './some-library';

data;
```

При наведении в редакторе на `data` вы увидете:

```ts
const data: BigInterface;
```

А зачастую хочется увидеть конкретные свойства и методы.

Однако есть сопособ "заставить" высчитать и показать все свойства объекта.

Для этого давайте напишем тип `Compute`:

```ts
type Compute<T> = {
    [K in keyof T]: T[K];
} & unknown;
```

Как вы можете увидеть выше, этот тип по сути просто копирует объект и добавляет к нему `unknown`.

Для тех, кто не знает, `& unknonw` никак не изменит изначальный тип.

Например в таком коде:

```ts
let a: number & unknown; // number
```

При наведении на `a` вы увидете `number`.

<!-- И наверника вы сейчас думаете: "Айюб, это все конечно круто, но какое это отношение имеет к раскрытию типов?" -->

Это работает в случае выше, так как для того чтобы объедиинть 2 типа, TS'у нужно вычеслить уже конкретные типы кажого из них и выдать смерженный результат.

Соответсвенно смерженный результат объединения какого-то интерфейса и `& unknown` не будет выведен в виде его алиаса (имени).

Тип `Compute`, приведенный выше, будет покрывать 90% ваших кейсов, но его можно чутокчку доработать и сделать более универсальным:

```ts
type ComputeDeep<T> = T extends object
    ? T extends (...args: any[]) => any
        ? (...args: ComputeDeep<Parameters<T>>) => ComputeDeep<ReturnType<T>>
        : {
              [K in keyof T]: ComputeDeep<T[K]>;
          } & unknown
    : T;
```

Мы сделали его рекурсивным, для того, чтобы раскрывались все вложенные объекты, так же добавили отедльный кейс для функций.

<!-- TODO check that everything is ok -->
Так же этот тип бывает полезно использовать при написании бибилиотеки, которая автоматом подхватывает типы. В результате такие типы обычно становятся очень не понятными и бывает тяжко понять, почему что-то не работает.

Однако если оборачивать результат в `ComputeDeep`, то можно добиться читабельных типов.

## 2 Популярные ошибки

### Отсутсвие поддержки readonly значений (зачастую с масивами)

<!-- TODO add explanation of what readonly -->

Данная проблема особенна важна при написании библиотек.

Давайте представим, что у нас есть функция `map`, которая абстрагирует вызов `.map` метода в массиве.

```ts
const map = <T, R>(arr: T[], mapper: (arg: T) => R): R[] => {
    return arr.map(mapper);
};
```

Как вы все знаете, `.map` не мутирует оригинальный масив, а создает новый.

Сооветсвенно, функция представленная выша должны работать и с `readonly` массивом.

Однако это не сработает:

```ts
const myReadonlyArray = [1, 2, 3, 4] as const;

map(myReadonlyArray, n => n * 2);
```

TS выведет ошибку:

```
Argument of type 'readonly [1, 2, 3]' is not assignable to parameter of type 'unknown[]'.
  The type 'readonly [1, 2, 3]' is 'readonly' and cannot be assigned to the mutable type 'unknown[]'.ts(2345)
```

Связанно это с тем, что `readonly` массив не имет мутирующих методов (например, `splice`, `pop`, etc.).

Следовательно, `readonly` массив не будет присаиваться в обычный массив.

Поэтому, в большинстве случаев (особенно с библиотеками) лучше зарание подготовиться к таким ситуациям, и принимать `readonly` массив, в тех случиях когда он не мутируется.

```diff
-const map = <T, R>(arr: T[], mapper: (arg: T) => R): R[] => {
+const map = <T, R>(arr: readonly T[], mapper: (arg: T) => R): R[] => {
    return arr.map(mapper);
};
```

### Нет поддержки union'ов

В TypeScript есть такая особенность, что он "распределяет" union'ы в условных типах (Type Distribution).

Наример:

```ts
type IsString<T> = T extends string ? true : false;

type TestIsString = IsString<number | string>; // boolean (true | false)

let a: string;

declare const b: string | number;

a = b;
// Type 'string | number' is not assignable to type 'string'.
//   Type 'number' is not assignable to type 'string'.ts(2322)
```
<!-- TODO revisit this text -->
Как вы видете в примере сверху, условие `extends string` было вызвано для каждого элемента union'а по отдельности, поэтому на выходе мы получили `boolean`, что эквивалентно union'у `true | false`.

Это поведение уникально для дженериков в условных типах. Так как по дефолту `string | number` не может быть присвоен к типу `string`, соответсвенно если это работало идентично в типе `IsStrng`, мы бы получили `false`.

Теперь, после того, как мы поняли, что такое Type Distribution, давайте рассмотрим примеры, в которых он может не работать и как это решить.

Так как для правильной типизации в реальном мире часто приходится сталкиваться с union'ами.

```ts
// wont work
type IsLiteralNumber<T extends number> = number extends T ? true : false;

type FunctionKeys<TObject extends object> = {
    [Key in keyof TObject]: TObject[Key] extends (...args:any[]) => any ? Key : never;
}[keyof TObject];

type IsArrayLike<T extends object> = T['length'] extends number ? true : false;

type HasKey<TObject extends object, Key extends string> = keyof TObject extends Key ? true : false;
```

<!-- TODO add it to the explanation of when type distribution works -->

Как вы можете видеть что дистрибуция не будет работать во всех случиях, когда условие применяется не на прямую к самому дженерику.

Однако тут есть одно исключение - mapped types:

```ts
type CallFunctions<TObject extends Record<string, () => any>> = {
    [Key in keyof TObject]: ReturnType<TObject[Key]>;
};
```

#### Как заставить TS распределить ваш тип

Так как мы знаем, что распределине происходит только тогда, когда условие было пременено на дженерик, мы можем специально написать такое условие которое будет проходить всегда.

Например тип `IsLiteralNumber` можно перепесать вот так:

```ts
type IsLiteralNumber<T extends number> =
    T extends unknwon
        ? number extends T
            ? true
            : false
        : never;
```

Мы специально добавили условие `extends unknown`, так как `unknwon` из себя представляет тип, без какой либо "мета" информации.

#### Хак, как проверить что работает распределение типов

Для проверки распределения типа, в большинстве случаев достаточно просто передать туда `never`, и убедиться что он вернет `never`:

```ts
type TestTypeDistribution = MyType<never>; // never
```

Связанно это с тем, что `never` по сути представляет из себя "пустой union". Соответсвенно, пустой union на вход, должен выдать пустой union на выход.

Так же может быть ситуация, когда по каким-то причинам нужно, чтобы ваш тип, который содержит условие не распределялся.

Например, хочется проверить, присваивается ли один тип к другому (может быть полезно для тестов, об этом поговорим чуть позже).

Так как мы тепер знаем, что дистрибуция работает, когда

```ts
type IsAssignalble<A, B> = [A] extends [B] ? true : false;
```

## Biavriance Hack

[link](https://stackoverflow.com/questions/61696173/strictfunctiontypes-restricts-generic-type)

Давайте теперь плавно перейдем к фукнциям и рассмотрим частую проблему, с которой можно столкунться при работе с колбэками.

```ts
const addEventListener = (
    target: EventTarget,
    type: string,
    listener: (event: Event) => void
) => {
    return target.addEventListener(type, listener);
}

addEventListener(document.body, 'click', (e: MouseEvent) => {
//                                       ^^^^^^^^^^^^^^^^^^^^
// Argument of type '(e: MouseEvent) => void' is not assignable to parameter of type '(event: Event) => void'.
//  Types of parameters 'e' and 'event' are incompatible.
//    Type 'Event' is missing the following properties from type 'MouseEvent': altKey, button, buttons, clientX, and 21 more.ts(2345)
  console.log(e.pageX + e.pageY);
});
```

Если у вас в tsconfig включена настройка `strictFunctionTypes`, то тогде вы получите следующую ошибку.


```ts
type EventHandler = {
  bivarianceHack(event: Event): void;
}['bivarianceHack'];

const addEventListener = (
    target: EventTarget,
    type: string,
    listener: EventHandler
) => {
    return target.addEventListener(type, listener);
}

addEventListener(document.body, 'click', (e: MouseEvent) => {
  console.log(e.pageX + e.pageY);
});
```

Почему это работает?

Связанно это с тем, что typescript подругому подходит к проверке типов функций, которые являются методами объктов.

Вы можете задаться вопросом, зачем?

Давайте рассмотрим такой пример:

```ts
class Base {
  a = 1;
  handler(object: Base) {}
}

class Child extends Base {
  b = 2;
  // a = 'asdf';

  handler(object: Child) {}
}
```

Так как при наследовании от базового класса можно только "сужать" (делать более детальными) типы дочерних свойств/методов, мы не может, например, взять и поменять `a` на строку.

ТС выдаст ошибку о том, что а должен быть присваевым к а в базовом классе.

Однако, как вы можете видеть функции `handler` так же не присваеваемые к друг другу, однако ошибки нет.

Ошибки тут нету потомучто такие кейсы рассмотриваются компилятором по другому, для того чтобы позволить адекватно работать с наследованием.

То же самое и происходит в нашем кейсе, TS видит, что `EventHandler` это не просто функция, а метод объекта, поэтому позволяет "сужать" аргументы.

```ts
type EventHandler = {
  bivarianceHack(event: Event): void;
}['bivarianceHack'];

const addEventListener = (
    target: EventTarget,
    type: string,
    listener: EventHandler
) => {
    return target.addEventListener(type, listener);
}
```

Сразу же отмечу интересный момент, если написать тип `EventHandler` в стиле объекта с функциями, то это уже не сработает:

```ts
type EventHandler = {
  bivarianceHack: (event: Event) => void;
}['bivarianceHack'];
```

Так как в таком кейсе компилятор не будет рассматривать функцию как метод объекта.

Так же можно создать удобный utility type для таких кейсов:

```ts
type BivarianceHanlder<Fn extends (...args: any[]) => any> = {
    bivarianceHack(...args: Parameters<Fn>): ReturnType<Fn>;
}['bivarianceHack'];

const addEventListener = (
    target: EventTarget,
    type: string,
    listener: BivarianceHanlder<(event: Event) => void>
) => {
    return target.addEventListener(type, listener);
}
```

## NoInfer

Продолжая тему с функциями, давайте рассмотрим проблему, которая может возникнуть, при использовании generic'ов.

```ts
class Base {
  a = 1;
  handler(object: Base) {}
}

class Child extends Base {
  b = 2;

  handler(object: Child) {}
}

const getA = <T>(obj: { a?: T; }, defaultValue?: T) => {
  return obj.a || defaultValue;
};

// must be error
getA({ a: new Child() }, new Base());
```

Просиходит это потому, что `T` опередлиться TS'ом как `Base`.

Однако мы хотим, чтобы `T` был `Child` и вызов функции `getA` был ошибкой.

На прямую это сделать не получиться, однако есть один хитрый способ, как "заставить" компилятор определять тип дженерика из первого аргумента.

```ts
type NoInfer<T> = [T][T extends any ? 0 : never];

const getA = <T>(obj: { a?: T; }, defaultValue?: NoInfer<T>) => {
  return obj.a || defaultValue;
};
```

Какой это имеет смысл ? `NoInfer` будет всегда возращать переданный тип.

Смысл тут в том, что, несмотра на бессмыслиность условия `T extends any`, TS не может его проверить, пока `T` не будет определен.

Соотвественно, он будет определен из первого аргумента функции и при вызове функции `getA` мы получим ошибку:

```ts
getA({ a: new Child() }, new Base());
//                       ^^^^^^^^^^
// Argument of type 'Base' is not assignable to parameter of type 'Child'.
//  Property 'b' is missing in type 'Base' but required in type 'Child'.ts(2345)
```

## Testing types

https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650

Давайте рассмотрим последнюю тему на сегодня, это тестирование типов.

Оно бывает очень полезно, для того, чтобы можно было уверенно менять код и не волноваться об неправильной типизации.

Так же мне это очень часто помогало в том, чтобы найти крайние случаи, о которых не задумывался, пока не начинал писать тест.

Однако, при написании тестов может возникнуть одна пробелма, о которой некторые могли уже задуматься.

Если что-то в нашей типизации по какой-то причине становиться `any`, то это ошибка, однако `any` присваивается ко всем занчениям, соотвсетсвенно, как вобще можно на 100% безопасно протестировать типизацию кода?

Для решения этой проблемы существует один хак, который я нашел в одном из issue в репозитории TypeScript'а.

```ts
type Equals<A, B> =
    (<T>() => T extends A ? 1 : 0) extends
    (<T>() => T extends B ? 1 : 0)
        ? true
        : false;
```

Смысл его в том, что он делает

<!-- TODO how to check that type must error -->
