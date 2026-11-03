# Обозреваем TS – план преподавателя

Слайдов: 54; ориентир 68 минут. Основной рассказ рассчитан на 68 минут; ещё 5 минут оставляем на вопросы. useRef, useEffect и собственный хук вынесены в дополнительные материалы.

## Задача и запуск TypeScript · 13 мин

### 1. Обозреваем TypeScript · 1 мин

Слайд: `#cover`

Начать с работающего магазина и задачи команды. Не вводить пока определения типов и контрактов: сначала аудитория должна увидеть, что именно может пойти не так. К TypeScript перейдём после обсуждения цены и других рисков.

Источники: [TypeScript Handbook · The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html).

### 2. У нас уже есть книжный магазин · 1 мин

Слайд: `#already-know`

Напомнить знакомый путь: каталог → BookCard → onAdd → корзина. cart – уже существующий объект корзины, здесь показан фрагмент, а не самостоятельная программа. Это опора на предыдущие лекции, а не проверка освоения. Пока не произносить «добавим типы»: сначала сформулировать новую задачу.

Вывод: Данные проходят через несколько функций и компонентов.

### 3. Задача: показать цену с доставкой · 1 мин

Слайд: `#delivery-task`

Сформулировать задачу без TypeScript: показать покупателю цену одной книги с фиксированной доставкой. Уточнить, что это маленький учебный расчёт, не полная модель заказа. Спросить, что должен получить и вернуть addDelivery. Переход: верный вызов прост, но что будет, если коллега передаст цену иначе?

Вывод: Нужно сохранить правильный расчёт, когда код меняют в разных местах.

### 4. Доставка: число даёт ожидаемый результат · 1 мин

Слайд: `#price-problem`

Сначала закрыть комментарии рукой или попросить не читать их и предсказать оба результата. Затем назвать проблему: автор функции рассчитывал на число, а вызывающий код передал строку. Здесь это ошибка внутри нашего кода. Строка из внешнего JSON потребует отдельной проверки во время выполнения – проверку значений разберём на примере unknown. Пока обсуждаем желаемую проверку, ещё не определение TS.

Вывод: Сначала проверим обычный рабочий вызов.

Источники: [TypeScript Handbook · The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html).

### 5. Цена стала строкой. Кто заметит? · 1 мин

Слайд: `#price-problem-error`

Сначала закрыть комментарии рукой или попросить не читать их и предсказать оба результата. Затем назвать проблему: автор функции рассчитывал на число, а вызывающий код передал строку. Здесь это ошибка внутри нашего кода. Строка из внешнего JSON потребует отдельной проверки во время выполнения – проверку значений разберём на примере unknown. Пока обсуждаем желаемую проверку, ещё не определение TS.

Вывод: Хотим обнаружить неверный вызов до запуска приложения.

Источники: [TypeScript Handbook · The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html).

### 6. Где ещё части приложения могут не совпасть? · 1 мин

Слайд: `#failure-cases`

Дать аудитории назвать последствия каждого случая. Поле prcie – опечатка; null – допустимое исходное состояние; succes вместо success – опечатка в допустимом варианте. Это три разные задачи, а не три синтаксические ошибки. Теперь можно ввести TypeScript: он позволяет описать ожидаемые значения и проверить обращения к ним. Обещать только проверки по известным типам. Внешний JSON всё равно проверяем в JavaScript, а правильность формулы не следует из типа number.

Вывод: Нужен способ описать ожидания и проверить, что код им соответствует.

### 7. TypeScript = JavaScript + система типов · 1 мин

Слайд: `#what-is-ts`

Вернуться к задаче доставки и тому же неверному вызову. Только теперь назвать инструмент: TypeScript расширяет JavaScript системой типов. number описывает допустимые значения; согласованное описание будем называть контрактом. Показать двоеточия и диагностику. Static означает анализ исходника без выполнения программы. Опечатки, null и форму состояния разберём дальше, когда научимся описывать объекты и варианты. TS не проверит JSON автоматически и не заметит любую неверную формулу.

Вывод: Теперь неверный вызов виден при проверке исходника.

Источники: [TypeScript Handbook · The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html).

### 8. Исходник: .ts / .tsx · 0.5 мин

Слайд: `#compiler-path`

Схема показывает обязанности, не строгий запрет на emit при ошибке. tsc может проверять и выпускать JS. esbuild/Babel могут преобразовывать TS без полной проверки типов. Уточнить: не все конструкции TS просто стираются; enums и parameter properties могут создавать JS, но в этой лекции они не используются. target не добавляет полифиллы API.

Вывод: При сборке React отдельно преобразуется и JSX.

Источники: [TypeScript Handbook · The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html), [TSConfig · noEmit](https://www.typescriptlang.org/tsconfig/noEmit.html).

### 9. Проверка: типы + ошибки · 0.5 мин

Слайд: `#compiler-check`

Схема показывает обязанности, не строгий запрет на emit при ошибке. tsc может проверять и выпускать JS. esbuild/Babel могут преобразовывать TS без полной проверки типов. Уточнить: не все конструкции TS просто стираются; enums и parameter properties могут создавать JS, но в этой лекции они не используются. target не добавляет полифиллы API.

Вывод: При сборке React отдельно преобразуется и JSX.

Источники: [TypeScript Handbook · The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html), [TSConfig · noEmit](https://www.typescriptlang.org/tsconfig/noEmit.html).

### 10. Преобразование: JavaScript · 0.5 мин

Слайд: `#compiler-transform`

Схема показывает обязанности, не строгий запрет на emit при ошибке. tsc может проверять и выпускать JS. esbuild/Babel могут преобразовывать TS без полной проверки типов. Уточнить: не все конструкции TS просто стираются; enums и parameter properties могут создавать JS, но в этой лекции они не используются. target не добавляет полифиллы API.

Вывод: При сборке React отдельно преобразуется и JSX.

Источники: [TypeScript Handbook · The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html), [TSConfig · noEmit](https://www.typescriptlang.org/tsconfig/noEmit.html).

### 11. Выполнение: браузер / Node.js · 0.5 мин

Слайд: `#compiler-run`

Схема показывает обязанности, не строгий запрет на emit при ошибке. tsc может проверять и выпускать JS. esbuild/Babel могут преобразовывать TS без полной проверки типов. Уточнить: не все конструкции TS просто стираются; enums и parameter properties могут создавать JS, но в этой лекции они не используются. target не добавляет полифиллы API.

Вывод: При сборке React отдельно преобразуется и JSX.

Источники: [TypeScript Handbook · The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html), [TSConfig · noEmit](https://www.typescriptlang.org/tsconfig/noEmit.html).

### 12. После компиляции получаем JavaScript · 1 мин

Слайд: `#compiler-output`

Правый код получен локальным TypeScript при сборке лекции, а не написан вручную. Показать исчезновение аннотаций и сохранение операций. Это исходник для минимального запуска на следующих слайдах. target здесь ES2022; не обещать полифиллы браузерных API.

Вывод: Аннотации number исчезли. Функция и вызов console.log остались.

Источники: [TypeScript Handbook · The Basics](https://www.typescriptlang.org/docs/handbook/2/basic-types.html).

### 13. Создадим проект и файл shop.ts · 0.5 мин

Слайд: `#tsc-setup`

Работать в отдельной пустой папке с Node.js и npm. После установки также появятся node_modules и package-lock.json. Команда npm init не создаёт shop.ts и tsconfig.json: их создаём вручную. Содержимое программы показано на предыдущем слайде; назначение и содержимое конфига разберём далее.

Вывод: Файлы уже созданы, но JavaScript появится только после запуска tsc.

Источники: [TypeScript · What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html).

### 14. Зачем нужен tsconfig.json? · 0.5 мин

Слайд: `#tsconfig-purpose`

tsconfig.json обозначает корень TypeScript-проекта и описывает его исходники и параметры компилятора. Это декларативный файл JSON, он сам не выполняется. Без него tsc тоже можно вызвать с файлами и параметрами командной строки; конфиг нужен для общего повторяемого режима проекта. Следующий слайд – содержимое файла, который нужно создать рядом с shop.ts.

Вывод: Сохраняем настройки в проекте, чтобы не перечислять их заново при каждом запуске tsc.

Источники: [TypeScript · What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html), [TSConfig · strict](https://www.typescriptlang.org/tsconfig/strict.html).

### 15. Создайте tsconfig.json рядом с shop.ts · 0.75 мин

Слайд: `#tsc-config`

Показать расположение: в одной папке package.json, shop.ts и tsconfig.json. include – вне compilerOptions. module: ESNext задаёт формат модулей, target – версию синтаксиса; это разные настройки. types: [] изолирует простой пример от автоматически подключённых @types из родительских папок. noUncheckedIndexedAccess усиливает доступ по индексу отдельно от strict. noEmitOnError по умолчанию false. Здесь файл создаём вручную; npx tsc --init – альтернативный способ получить стартовый конфиг, его шаблон может отличаться.

Вывод: Название файла – tsconfig.json. Внутри JSON с настройками, а не код JavaScript.

Источники: [TypeScript · What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html), [TSConfig · strict](https://www.typescriptlang.org/tsconfig/strict.html), [TSConfig · noEmitOnError](https://www.typescriptlang.org/tsconfig/noEmitOnError.html).

### 16. Запустим tsc с нашими настройками · 0.25 мин

Слайд: `#tsc-run`

npx запускает исполняемую команду npm-пакета. В нашем проекте npm install -D typescript уже установил локальный tsc, глобальная установка не нужна. Сам npx типы не проверяет: он запускает tsc. Сначала запустить npx tsc -p tsconfig.json, затем при успешном завершении node dist/shop.js: в консоли 790. Строка с # – комментарий терминала, а не команда или часть shop.ts. Не добавлять shop.ts после -p: выбранный конфиг уже задаёт исходники. При вызове tsc с именами файлов в командной строке tsconfig.json игнорируется. noEmitOnError не удаляет старый dist/shop.js; после неуспешной компиляции старый файл запускать не нужно. В браузерном приложении подключают полученный .js; следующий слайд связывает это со сборкой React.

Вывод: Измените 690 на "690": tsc сообщит об ошибке и не выпустит новый JS.

Источники: [TypeScript · What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html), [TSConfig · noEmitOnError](https://www.typescriptlang.org/tsconfig/noEmitOnError.html), [npm · npx](https://docs.npmjs.com/cli/v11/commands/npx).

### 17. В React проверка живёт рядом со сборкой · 1 мин

Слайд: `#build-pipeline`

В конкретном React-проекте сохраняем конфигурацию его сборщика. .d.ts описывает API библиотеки для проверяющего, не является реализацией. Не переносить упрощённый tsconfig предыдущего слайда вслепую в существующий проект.

Вывод: В build-скрипте: tsc --noEmit && команда сборщика.

Источники: [TSConfig · noEmit](https://www.typescriptlang.org/tsconfig/noEmit.html), [React · Using TypeScript](https://react.dev/learn/typescript).

## Базовые типы и данные · 16 мин

### 18. Начните с вывода типов · 1 мин

Слайд: `#inference`

У let price выводится number. У const title строковый литерал; это подробнее понадобится в union. Аннотирование не преобразует строку в число.

Вывод: Не требуется добавлять : number к каждому числу.

Источники: [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).

### 19. Выведенный number тоже защищает от строки · 1 мин

Слайд: `#inference-error`

У let price выводится number. У const title строковый литерал; это подробнее понадобится в union. Аннотирование не преобразует строку в число.

Вывод: Выведенный тип проверяется так же, как явно записанный.

Источники: [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).

### 20. Функция: что получает и что возвращает · 2 мин

Слайд: `#function-types`

Начать с total: два числа на входе, число на выходе. После скобок аннотация возвращаемого типа. Затем printTitle: принимает строку и выводит её в консоль; возвращаемого полезного значения нет. Не вводить здесь синтаксис типа callback и стрелочные функции: для первого знакомства достаточно двух обычных функций.

Вывод: Тип функции описывает, как её можно вызвать.

Источники: [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).

### 21. Опишем знакомую книгу · 2 мин

Слайд: `#book-model`

Каждое поле знакомо из React-API. color из прошлой демонстрации не нужен для учебной модели. type – имя для типа, а не создание объекта в памяти.

Вывод: Book описывает форму объекта; Book[] – список таких объектов.

Источники: [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).

### 22. Необязательное поле может отсутствовать · 2 мин

Слайд: `#optional-fields`

Объяснить два разных знака вопроса: объявление поля и JavaScript optional chaining. readonly – неглубокая статическая защита, Object.freeze она не вызывает.

Вывод: Удобный контракт честно описывает отсутствие данных.

Источники: [TypeScript Handbook · Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html).

### 23. «Ещё не выбрали» – тоже состояние · 2 мин

Слайд: `#null`

Ввести знак | как «или», подробный блок о юнионах впереди. Это первый пример сужения. Уточнить, что пример функции самостоятелен, selected показывает тип состояния.

Вывод: Проверка значения уточняет его тип в текущей ветке.

Источники: [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html), [TypeScript Handbook · Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

### 24. Повторяющийся тип можно назвать · 1 мин

Слайд: `#selected-book-type`

Сравнить с предыдущим слайдом: два повторения Book | null заменили на SelectedBook. Ни значение null, ни проверка в if не изменились. type не создаёт новый объект или функцию. Теперь, когда идея имени типа знакома по конкретной задаче, позже сравним type с interface.

Вывод: Псевдоним переиспользует тип, а допустимые значения остаются прежними.

Источники: [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html), [TypeScript Handbook · Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

### 25. any: используем значение без проверки типов · 1 мин

Слайд: `#any-intro`

Здесь пример работает с правильным объектом. Если price окажется строкой, toFixed упадёт при выполнении. Не помечать это как статическую ошибку TS: any отключил проверку использования значения. На следующем слайде unknown позволит сохранить неизвестность.

Вывод: any не проверяет данные и не делает их безопасными.

Источники: [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).

### 26. Неизвестные данные обозначаем unknown · 1 мин

Слайд: `#any-unknown`

В отличие от any, неизвестное значение не разрешает произвольные операции. Пока показываем только хранение разных значений; на следующем слайде сравним одно и то же обращение к price у any и unknown.

Вывод: unknown честно сообщает: «сначала выясни, что это за значение».

Источники: [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html), [TypeScript Handbook · Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

### 27. Разница any и unknown · 1 мин

Слайд: `#any-unknown-comparison`

В unsafe параметр any: чтение price разрешено без проверки. В safe параметр unknown: TS18046 останавливает чтение поля. Это перенесённый пример «у unknown нельзя сразу читать price»; отдельный повторяющийся слайд не нужен. Следующий слайд показывает простую проверку typeof.

Вывод: any разрешает обращение. unknown требует сначала проверить значение.

Источники: [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html), [TypeScript Handbook · Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

### 28. unknown становится полезным после проверки · 2 мин

Слайд: `#unknown-narrow`

Объяснить пример на знакомом книжном магазине. any отключает проверку обращения; unknown требует сначала разобраться со значением.

Вывод: any отключает проверку обращения; unknown требует сначала разобраться со значением.

Источники: [TypeScript Handbook · Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

## Type, interface и расширение · 5 мин

### 29. interface описывает форму объекта · 2 мин

Слайд: `#interface`

Здесь локально сокращён Book до трёх полей ради чтения. FeaturedBook должен иметь все поля Book плюс badge. Объявление интерфейса не создаёт значения и конструктора.

Вывод: interface удобно читать как «у значения есть такие поля».

Источники: [TypeScript Handbook · Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html).

### 30. Расширим книгу дополнительным полем · 2 мин

Слайд: `#extend-model`

Слева interface FeaturedBook extends Book, справа type FeaturedBook = Book & {...}. Оба примера используют Book из предыдущего раздела. Это расширение формы данных, а не создание класса или копии объекта. Не вводить конфликтующие пересечения и declaration merging.

Вывод: В расширенном контракте остаются все поля Book и добавляется badge.

Источники: [TypeScript Handbook · Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html).

### 31. Оба подходят для props и объектов · 1 мин

Слайд: `#type-vs-interface`

Сравнить только знакомые задачи: объект, имя union и расширение. Оба способа подходят для props, типы стираются из JavaScript. Внутри одного проекта сохраняем общий стиль; углублённые особенности объединения объявлений здесь не нужны.

Вывод: В этой лекции модели записываем через type; interface тоже корректен.

Источники: [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html), [TypeScript Handbook · Object Types](https://www.typescriptlang.org/docs/handbook/2/objects.html).

## Простые union · 4 мин

### 32. Перечислим допустимые статусы · 1 мин

Слайд: `#literal-union`

Объяснить пример на знакомом книжном магазине. Строковые литералы соединяем знаком | – «или».

Вывод: Строковые литералы соединяем знаком | – «или».

Источники: [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).

### 33. Опечатка не входит в допустимые статусы · 1 мин

Слайд: `#literal-union-error`

Объяснить пример на знакомом книжном магазине. Строковые литералы соединяем знаком | – «или».

Вывод: Union позволяет заранее перечислить допустимые значения.

Источники: [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).

### 34. Если вариантов два – уточним нужный · 1 мин

Слайд: `#union-check`

Объяснить пример на знакомом книжном магазине. typeof помогает выбрать операцию, которая подходит текущему значению.

Вывод: typeof помогает выбрать операцию, которая подходит текущему значению.

Источники: [TypeScript Handbook · Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

### 35. У числа нет toUpperCase · 1 мин

Слайд: `#union-check-error`

Объяснить пример на знакомом книжном магазине. typeof помогает выбрать операцию, которая подходит текущему значению.

Вывод: Сначала уточняем вариант, затем вызываем его методы.

Источники: [TypeScript Handbook · Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).

## Pick, Omit и Record · 6 мин

### 36. Pick: возьмём поля для карточки · 2 мин

Слайд: `#pick-fields`

Объяснить пример на знакомом книжном магазине. Pick создаёт тип выбранных полей. Данные объекта он не копирует.

Вывод: Pick создаёт тип выбранных полей. Данные объекта он не копирует.

Источники: [TypeScript · Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html).

### 37. Omit: опишем книгу без id · 2 мин

Слайд: `#omit-fields`

Объяснить пример на знакомом книжном магазине. Omit убирает ключ из типа; из существующего объекта поле не удаляется.

Вывод: Omit убирает ключ из типа; из существующего объекта поле не удаляется.

Источники: [TypeScript · Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html).

### 38. Record описывает словарь корзины · 2 мин

Слайд: `#record`

Обязательно отметить noUncheckedIndexedAccess: без него Record<string, number> может скрыть undefined при произвольном доступе. ?? 0 соответствует уже знакомой корзине.

Вывод: Тип словаря не создаёт отсутствующие ключи в объекте.

Источники: [TypeScript · Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html).

## Дженерики · 2 мин

### 39. Дженерик сохраняет тип переданного значения · 2 мин

Слайд: `#react-generics`

На дженерики оставляем две минуты. Задача: обернуть одно значение в массив без потери его типа. Сначала прочитать toArray<string>: T становится string и в параметре, и в результате string[]. Затем заменить выбранный тип на number для второго вызова. Имя T условное; это параметр типа, а не значение JavaScript. Явные <string> и <number> здесь нужны для первого знакомства: в обоих вызовах TypeScript может вывести тип из аргумента. Угловые скобки передают тип, круглые – значение. В React тот же приём встретится у useState<Book[]>; сам хук здесь не разбираем.

Вывод: Одна реализация работает с разными типами и сохраняет связь между входом и результатом.

Источники: [TypeScript Handbook · Generics](https://www.typescriptlang.org/docs/handbook/2/generics.html).

## TypeScript в React · 22 мин

### 40. Подключаем типы к знакомому React-проекту · 1 мин

Слайд: `#react-start`

На слайде перечислены зависимости, а не универсальная команда изменения проекта. Использовать настройки его сборщика: упрощённый конфиг shop.ts не переносим целиком в React. Типы React приходят из @types, а JSX поддерживает TypeScript.

Вывод: Шаблон React + TS обычно уже подготовил эти настройки.

Источники: [React · Using TypeScript](https://react.dev/learn/typescript), [TSConfig · noEmit](https://www.typescriptlang.org/tsconfig/noEmit.html).

### 41. Props – обычный объект с типом · 2 мин

Слайд: `#react-props`

Book импортируется из модели. React выводит возвращаемый тип компонента; React.FC и явный тип JSX-результата здесь не требуются. Тип Props описывает входные данные компонента.

Вывод: Не нужно отдельно аннотировать каждое поле внутри компонента.

Источники: [React · Using TypeScript](https://react.dev/learn/typescript).

### 42. Типизируем действие «добавить в корзину» · 1 мин

Слайд: `#react-callback`

Прочитать (id: string) => void как «получает строку, вызывающий не использует результат». В onClick передаётся функция. На следующем слайде book.price вместо book.id нарушит этот контракт.

Вывод: Тип функции описывает аргументы, которые компонент может передать родителю.

Источники: [React · Using TypeScript](https://react.dev/learn/typescript), [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).

### 43. Обработчик ждёт id, а получил цену · 1 мин

Слайд: `#react-callback-error`

Прочитать (id: string) => void как «получает строку, вызывающий не использует результат». В onClick передаётся функция. На следующем слайде book.price вместо book.id нарушит этот контракт.

Вывод: Тип props обнаруживает ошибку внутри компонента.

Источники: [React · Using TypeScript](https://react.dev/learn/typescript), [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).

### 44. useState часто выводит тип сам · 1.5 мин

Слайд: `#react-hooks`

Пример расположен в теле компонента. Вызовы setter находятся внутри reset, а не при рендере. Не требуется useState<number>(0): первоначальное число достаточно информативно.

Вывод: useState(0) даёт number, а setter проверяет новое значение.

Источники: [React · Using TypeScript](https://react.dev/learn/typescript).

### 45. setCount тоже ожидает число · 1.5 мин

Слайд: `#react-hooks-error`

Пример расположен в теле компонента. Вызовы setter находятся внутри reset, а не при рендере. Не требуется useState<number>(0): первоначальное число достаточно информативно.

Вывод: Для очевидного начального значения явный параметр типа не нужен.

Источники: [React · Using TypeScript](https://react.dev/learn/typescript).

### 46. Для пустого массива и null подскажем тип · 2 мин

Слайд: `#react-collections`

Угловые скобки передают тип готовому хуку. Здесь не пишем собственную generic-функцию: учимся читать API библиотеки. Book[] допускает пустой массив, Book | null – отсутствие выбранной книги.

Вывод: useState<Book[]> и useState<Book | null> – применение готового дженерика.

Источники: [React · Using TypeScript](https://react.dev/learn/typescript).

### 47. Применим union к состоянию загрузки · 1 мин

Слайд: `#react-status`

Объяснить пример на знакомом книжном магазине. Статус по-прежнему строка, но набор допустимых строк ограничен.

Вывод: Статус по-прежнему строка, но набор допустимых строк ограничен.

Источники: [React · Using TypeScript](https://react.dev/learn/typescript).

### 48. Union защищает и состояние React · 1 мин

Слайд: `#react-status-error`

Объяснить пример на знакомом книжном магазине. Статус по-прежнему строка, но набор допустимых строк ограничен.

Вывод: useState<Status> принимает только значения из нашего union.

Источники: [React · Using TypeScript](https://react.dev/learn/typescript).

### 49. В JSX тип события обычно уже известен · 1 мин

Слайд: `#react-inline-event`

Объяснить пример на знакомом книжном магазине. Наведите на event в редакторе: тип часто можно получить без ручной аннотации.

Вывод: Наведите на event в редакторе: тип часто можно получить без ручной аннотации.

Источники: [React · Using TypeScript](https://react.dev/learn/typescript).

### 50. Вынесенному обработчику дадим готовый тип · 2 мин

Слайд: `#react-event`

ChangeEvent импортируется через import type из react. HTMLInputElement – готовый DOM-тип TypeScript. currentTarget указывает на input, для которого установлен обработчик. Пустая строка – нормальный черновик формы.

Вывод: Даже у input type="number" значение поля читается как строка.

Источники: [React · Using TypeScript](https://react.dev/learn/typescript).

### 51. Готовые типы ищем у библиотеки · 1 мин

Слайд: `#react-ready-types`

DOM-типы вроде HTMLInputElement входят в lib.dom TypeScript. ChangeEvent, ReactNode и ComponentProps приходят из @types/react. Многие библиотеки поставляют .d.ts вместе с пакетом; @types нужен там, где отдельные описания действительно отсутствуют. Не предлагать any как замену изучению API.

Вывод: Для сторонней библиотеки сначала проверяем её экспортируемые типы и документацию.

Источники: [React · Using TypeScript](https://react.dev/learn/typescript).

### 52. ReactNode описывает содержимое children · 2 мин

Слайд: `#react-children`

ReactNode импортируется через import type. Не пытаться свести children только к string или одному JSX-элементу. Панель – знакомая композиция компонентов; обширное сравнение ReactElement здесь не требуется.

Вывод: Готовый ReactNode покрывает значения, которые React может отрисовать.

Источники: [React · Using TypeScript](https://react.dev/learn/typescript).

### 53. ComponentProps переиспользует props кнопки · 2 мин

Слайд: `#react-button`

ComponentProps импортируется через import type из react. Угловые скобки содержат строковый литерал button, выбирающий элемент. Не переписывать тип onClick вручную. Пример не занимается ref: продвинутые варианты ComponentPropsWithRef можно оставить за рамками.

Вывод: Переиспользуем контракт стандартного элемента вместо ручного списка атрибутов.

Источники: [React · Using TypeScript](https://react.dev/learn/typescript).

### 54. Promise<Book[]> описывает результат после await · 2 мин

Слайд: `#react-promise`

На этот слайд оставляем две минуты. Прочитать async getBooks как Promise<Book[]>, затем await как получение Book[]. Ошибку запроса обрабатывают через try/catch; Promise<Book[]> не задаёт её тип. Локальная async-функция возвращает уже известный Book[]. В настоящем fetch ответ JSON нужно проверить на границе приложения, например валидатором схемы. Promise<Book[]> описывает успешное значение после await, а не тип исключения. Подробный пользовательский guard вынесен в дополнение.

Вывод: Тип результата запроса не проверяет внешний JSON автоматически.

Источники: [TypeScript Handbook · Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html), [React · Using TypeScript](https://react.dev/learn/typescript).
