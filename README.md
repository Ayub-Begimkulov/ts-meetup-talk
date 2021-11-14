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

## 2 Популярные ошибки
