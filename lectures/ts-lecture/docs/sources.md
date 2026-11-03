# Источники и технические границы

Официальная документация проверена 17 октября 2026 года. Учебные примеры написаны для книжного магазина курса и проверяются локальным TypeScript 5.9.3. Номер версии фиксирует воспроизводимость, не заявляет актуальность последнего релиза.

- [TypeScript Handbook — The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html): статическая проверка, выпуск JS и стирание аннотаций.
- [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html): примитивы, массивы, функции, union, type/interface, утверждения типов.
- [Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html): optional/readonly, расширение контрактов, пересечения и дополнительная проверка лишних полей у свежих объектных литералов (уточнение проверено 24 октября 2026 года).
- [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html): ветвления, guards, predicates, discriminated unions, never.
- [Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html): параметры типов, ограничения и связь ключа со значением.
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html): Pick, Omit, Partial, Readonly, Record, Extract, Exclude, NonNullable, ReturnType.
- [What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html): назначение конфига, состав проекта, запуск tsc с -p и отличие от передачи файлов в командной строке. Проверено 24 октября 2026 года.
- [strict](https://www.typescriptlang.org/tsconfig/strict.html), [noEmit](https://www.typescriptlang.org/tsconfig/noEmit.html), [noEmitOnError](https://www.typescriptlang.org/tsconfig/noEmitOnError.html): режимы проверки и выпуска.
- [React — Using TypeScript](https://react.dev/learn/typescript): props, .tsx, useState и типы событий.

Компилятор TS проверяет исходник без выполнения программы. При noEmitOnError=false диагностика не обязательно блокирует выпуск JS. В примерах используются конструкции типов, которые стираются; утверждение, что абсолютно любая конструкция TypeScript всегда просто удаляется, не делается. target не обеспечивает полифиллы.

Объекты Book для ранних примеров содержат author; компактный guard и итоговый React-пример используют явно сокращённый контракт id/title/price. Оба контрактa согласованы со своими примерами. Модель LoadState предназначена для первой загрузки; фоновое обновление с сохранёнными данными потребовало бы расширить её.

React-раздел обновлён 24 октября 2026 года: [useRef](https://react.dev/reference/react/useRef), [useEffect](https://react.dev/reference/react/useEffect), [готовые типы React](https://react.dev/learn/typescript). Примеры проверяются с установленными @types/react 19.3.0; для событий используются готовые типы, DOM-ссылки указываются через HTMLInputElement.

[npx в документации npm](https://docs.npmjs.com/cli/v11/commands/npx): запуск исполняемой команды из пакета; в учебном примере используется заранее установленный локальный tsc. Проверено 24 октября 2026 года.
