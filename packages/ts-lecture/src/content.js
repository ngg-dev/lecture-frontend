import { snippets, bookType, bookValue } from './examples.js';
import { examplePairs } from './example-pairs.js';
import { reactSnippets } from './react-examples.js';
const allSnippets = { ...snippets, ...reactSnippets };
export const sources = {
  npx: ['npm · npx', 'https://docs.npmjs.com/cli/v11/commands/npx'],
  config: ['TypeScript · What is a tsconfig.json', 'https://www.typescriptlang.org/docs/handbook/tsconfig-json.html'],
  basics: ['TypeScript Handbook · The Basics', 'https://www.typescriptlang.org/docs/handbook/2/basic-types.html'],
  everyday: ['TypeScript Handbook · Everyday Types', 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html'],
  objects: ['TypeScript Handbook · Object Types', 'https://www.typescriptlang.org/docs/handbook/2/objects.html'],
  narrowing: ['TypeScript Handbook · Narrowing', 'https://www.typescriptlang.org/docs/handbook/2/narrowing.html'],
  generics: ['TypeScript Handbook · Generics', 'https://www.typescriptlang.org/docs/handbook/2/generics.html'],
  utility: ['TypeScript · Utility Types', 'https://www.typescriptlang.org/docs/handbook/utility-types.html'],
  strict: ['TSConfig · strict', 'https://www.typescriptlang.org/tsconfig/strict.html'],
  emit: ['TSConfig · noEmitOnError', 'https://www.typescriptlang.org/tsconfig/noEmitOnError.html'],
  noEmit: ['TSConfig · noEmit', 'https://www.typescriptlang.org/tsconfig/noEmit.html'],
  ref: ['React · useRef', 'https://react.dev/reference/react/useRef'],
  effect: ['React · useEffect', 'https://react.dev/reference/react/useEffect'],
  react: ['React · Using TypeScript', 'https://react.dev/learn/typescript']
};
export const chapters = [
  {
    "id": "why",
    "title": "Задача и запуск TypeScript"
  },
  {
    "id": "typing",
    "title": "Базовые типы и данные"
  },
  {
    "id": "contracts",
    "title": "Type, interface и расширение"
  },
  {
    "id": "unions",
    "title": "Простые union"
  },
  {
    "id": "utilities",
    "title": "Pick, Omit и Record"
  },
  {
    "id": "generics",
    "title": "Дженерики"
  },
  {
    "id": "react",
    "title": "TypeScript в React"
  }
];
const code = (id, file = 'catalog.ts') => ({ file, text: allSnippets[id].text, snippet: id });
const originalGroups = [
  { id: 'cover', chapter: 'why', kind: 'cover', title: 'Обозреваем\nTypeScript', lead: 'Каталог, карточки и корзина уже работают. Как заметить ошибки до покупателя?', minutes: 1, notes: 'Начать с работающего магазина и задачи команды. Не вводить пока определения типов и контрактов: сначала аудитория должна увидеть, что именно может пойти не так. К TypeScript перейдём после обсуждения цены и других рисков.', sources: ['basics'] },
  { id: 'already-know', chapter: 'why', title: 'У нас уже есть книжный магазин', lead: 'Упрощённый фрагмент знакомого приложения на JavaScript.', code: { file: 'shop.js', text: 'const book = {\n  id: "b-101",\n  title: "Солярис",\n  price: 690\n};\n\nfunction addToCart(id) {\n  cart[id] = (cart[id] ?? 0) + 1;\n}' }, bullets: ['Каталог передаёт книгу в карточку.', 'Карточка показывает title и price.', 'По клику onAdd передаёт id в корзину.'], takeaway: 'Данные проходят через несколько функций и компонентов.', minutes: 1, notes: 'Напомнить знакомый путь: каталог → BookCard → onAdd → корзина. cart – уже существующий объект корзины, здесь показан фрагмент, а не самостоятельная программа. Это опора на предыдущие лекции, а не проверка освоения. Пока не произносить «добавим типы»: сначала сформулировать новую задачу.' },
  { id: 'delivery-task', chapter: 'why', title: 'Задача: показать цену с доставкой', lead: 'Добавляем к цене книги фиксированные 100 ₽ за доставку.', cards: [['Цена книги', 'В расчёт поступает число 690.', 'ВХОД'], ['Расчёт', 'addDelivery прибавляет 100 к цене.', 'ДЕЙСТВИЕ'], ['Итог', 'Покупатель видит 790 ₽.', 'РЕЗУЛЬТАТ']], takeaway: 'Нужно сохранить правильный расчёт, когда код меняют в разных местах.', minutes: 2, notes: 'Сформулировать задачу без TypeScript: показать покупателю цену одной книги с фиксированной доставкой. Уточнить, что это маленький учебный расчёт, не полная модель заказа. Спросить, что должен получить и вернуть addDelivery. Переход: верный вызов прост, но что будет, если коллега передаст цену иначе?' },
  { id: 'price-problem', chapter: 'why', title: 'Цена стала строкой. Кто заметит?', lead: 'Корзина ждёт число, а другой участок кода передаёт "690".', code: { file: 'cart.js', text: 'function addDelivery(price) {\n  return price + 100;\n}\n\naddDelivery(690);   // 790\naddDelivery("690"); // "690100"' }, bullets: ['JavaScript выполнит оба вызова.', 'Во втором случае + склеивает строки.', 'Хочется увидеть несогласованность до показа покупателю.'], takeaway: 'Хотим обнаружить неверный вызов до запуска приложения.', minutes: 2, notes: 'Сначала закрыть комментарии рукой или попросить не читать их и предсказать оба результата. Затем назвать проблему: автор функции рассчитывал на число, а вызывающий код передал строку. Здесь это ошибка внутри нашего кода. Строка из внешнего JSON потребует отдельной проверки во время выполнения – проверку значений разберём на примере unknown. Пока обсуждаем желаемую проверку, ещё не определение TS.', sources: ['basics'] },
  { id: 'failure-cases', chapter: 'why', title: 'Где ещё части приложения могут не совпасть?', lead: 'Все примеры – возможные изменения знакомого магазина.', cards: [['Опечатка в поле', 'Карточка читает book.prcie. Получаем undefined вместо цены.', 'ДАННЫЕ'], ['Пустой выбор', 'До клика selected равен null. Чтение selected.title вызовет ошибку.', 'ОТСУТСТВИЕ'], ['Опечатка в статусе', 'Записали status: "succes". Ветка успешной загрузки не покажет каталог.', 'СОСТОЯНИЕ']], takeaway: 'Нужен способ описать ожидания и проверить, что код им соответствует.', minutes: 2, notes: 'Дать аудитории назвать последствия каждого случая. Поле prcie – опечатка; null – допустимое исходное состояние; succes вместо success – опечатка в допустимом варианте. Это три разные задачи, а не три синтаксические ошибки. Теперь можно ввести TypeScript: он позволяет описать ожидаемые значения и проверить обращения к ним. Обещать только проверки по известным типам. Внешний JSON всё равно проверяем в JavaScript, а правильность формулы не следует из типа number.' },
  { id: 'what-is-ts', chapter: 'why', title: 'TypeScript = JavaScript + система типов', lead: 'Опишем ожидание addDelivery: на входе и на выходе – число.', code: code('priceBoth'), exampleState: 'comparison', bullets: [': number описывает контракт параметра.', 'Проверка статическая: код не нужно запускать.', 'Подсказки редактора и безопаснее переименования – из той же информации.'], takeaway: 'Теперь неверный вызов виден при проверке исходника.', minutes: 2, notes: 'Вернуться к задаче доставки и тому же неверному вызову. Только теперь назвать инструмент: TypeScript расширяет JavaScript системой типов. number описывает допустимые значения; согласованное описание будем называть контрактом. Показать двоеточия и диагностику. Static означает анализ исходника без выполнения программы. Опечатки, null и форму состояния разберём дальше, когда научимся описывать объекты и варианты. TS не проверит JSON автоматически и не заметит любую неверную формулу.', sources: ['basics'] },
  { id: 'compiler-path', chapter: 'why', title: 'У исходника два результата', lead: 'Проверка типов и получение JavaScript – разные задачи.', steps: [['Исходник', '.ts / .tsx', 'Парсер читает синтаксис. В .tsx дополнительно разрешён JSX.'], ['Проверка', 'типы + ошибки', 'TS связывает имена и анализирует совместимость типов и ветви кода. Программа при этом не выполняется.'], ['Преобразование', 'JavaScript', 'Аннотации, type и interface стираются. target задаёт преобразование поддерживаемого синтаксиса.'], ['Выполнение', 'браузер / Node.js', 'Выполняется JS: операции, запросы, обработчики. Проверок интерфейса Book здесь уже нет.']], takeaway: 'При сборке React отдельно преобразуется и JSX.', minutes: 3, notes: 'Схема показывает обязанности, не строгий запрет на emit при ошибке. tsc может проверять и выпускать JS. esbuild/Babel могут преобразовывать TS без полной проверки типов. Уточнить: не все конструкции TS просто стираются; enums и parameter properties могут создавать JS, но в этой лекции они не используются. target не добавляет полифиллы API.', sources: ['basics', 'noEmit'] },
  { id: 'compiler-demo', chapter: 'why', title: 'Посмотрим на настоящий компилятор', lead: 'Измените аргумент и сравните диагностику с получившимся JavaScript.', demo: 'compiler', takeaway: 'Типы исчезают; ошибка типов сама по себе не всегда запрещает выпуск JS.', minutes: 3, notes: 'Начать с правильного вызова: показать отсутствие : number в JS. Затем нажать «Строка вместо числа»: JS всё ещё выпускается. Включить noEmitOnError – выдача исчезнет. Редактор использует локальный TypeScript 5.9.3, а не имитацию диагностики. Введённый JS не запускается.', sources: ['basics', 'emit'] },
  { id: 'tsc-setup', chapter: 'why', title: 'Создадим проект и файл shop.ts', lead: 'В отдельной пустой папке подготовим пример без React.', code: { file: 'shop.ts · создайте файл', text: 'function addDelivery(price: number): number {\n  return price + 100;\n}\n\nconsole.log(addDelivery(690)); // 790' }, bullets: ['В терминале этой папки: npm init -y', 'Установите компилятор: npm install -D typescript', 'Создайте shop.ts с кодом слева.', 'Рядом создайте tsconfig.json – настройки проекта.'], takeaway: 'shop.ts содержит программу; tsconfig.json задаёт правила её проверки и компиляции.', minutes: 0.5, notes: 'Это рецепт для отдельной пустой папки с установленным Node.js и npm. Команды выполнить в её терминале. Создать shop.ts вручную, вставить пример. Затем создать рядом файл с точным именем tsconfig.json: расширение .json, не .js. Пока не запускать tsc – сначала объясним назначение настроек. Полный воспроизводимый пример есть в examples/standalone.', sources: ['basics', 'config'] },
  { id: 'tsconfig-purpose', chapter: 'why', title: 'Зачем нужен tsconfig.json?', lead: 'Один файл хранит общие настройки TypeScript для проекта.', cards: [['Какие файлы', 'include выбирает исходники: здесь только shop.ts.', 'СОСТАВ ПРОЕКТА'], ['Как проверять', 'compilerOptions задаёт правила: например, strict включает строгие проверки.', 'ПРАВИЛА'], ['Как выпускать JS', 'target задаёт версию выходного синтаксиса, outDir – папку результата.', 'КОМПИЛЯЦИЯ']], takeaway: 'Сохраняем настройки в проекте, чтобы не перечислять их заново при каждом запуске tsc.', minutes: 0.5, notes: 'tsconfig.json обозначает корень TypeScript-проекта и описывает его исходники и параметры компилятора. Это декларативный файл JSON, он сам не выполняется. Без него tsc тоже можно вызвать с файлами и параметрами командной строки; конфиг нужен для общего повторяемого режима проекта. Следующий слайд – содержимое файла, который нужно создать рядом с shop.ts.', sources: ['config', 'strict'] },
  { id: 'tsc-config', chapter: 'why', title: 'Создайте tsconfig.json рядом с shop.ts', lead: 'Вставьте эти настройки в созданный файл.', code: { file: 'tsconfig.json', text: '{\n  "compilerOptions": {\n    "target": "ES2022",\n    "module": "ESNext",\n    "strict": true,\n    "types": [],\n    "noUncheckedIndexedAccess": true,\n    "noEmitOnError": true,\n    "outDir": "dist"\n  },\n  "include": ["shop.ts"]\n}' }, bullets: ['include: проверяем shop.ts.', 'strict и noUncheckedIndexedAccess: усиливаем проверку типов.', 'noEmitOnError: не выпускаем JS при ошибках.', 'target и outDir: синтаксис ES2022, результат в dist/.'], takeaway: 'Название файла – tsconfig.json. Внутри JSON с настройками, а не код JavaScript.', minutes: 0.75, notes: 'Показать расположение: в одной папке package.json, shop.ts и tsconfig.json. include – вне compilerOptions. module: ESNext задаёт формат модулей, target – версию синтаксиса; это разные настройки. types: [] изолирует простой пример от автоматически подключённых @types из родительских папок. noUncheckedIndexedAccess усиливает доступ по индексу отдельно от strict. noEmitOnError по умолчанию false. Здесь файл создаём вручную; npx tsc --init – альтернативный способ получить стартовый конфиг, его шаблон может отличаться.', sources: ['config', 'strict', 'emit'] },
  { id: 'tsc-run', chapter: 'why', title: 'Запустим tsc с нашими настройками', lead: 'Обе команды выполняем из папки с shop.ts и tsconfig.json.', code: { file: 'Терминал · команды по порядку', text: 'npx tsc -p tsconfig.json\nnode dist/shop.js\n\n# Результат второй команды: 790' }, bullets: ['npx запускает команду из npm-пакета: здесь локальный tsc.', '-p tsconfig.json указывает настройки проекта.', 'tsc проверит shop.ts и создаст dist/shop.js.', 'node dist/shop.js выполнит JS и выведет 790.'], takeaway: 'Измените 690 на "690": tsc сообщит об ошибке и не выпустит новый JS.', minutes: 0.25, notes: 'npx запускает исполняемую команду npm-пакета. В нашем проекте npm install -D typescript уже установил локальный tsc, глобальная установка не нужна. Сам npx типы не проверяет: он запускает tsc. Сначала запустить npx tsc -p tsconfig.json, затем при успешном завершении node dist/shop.js: в консоли 790. Строка с # – комментарий терминала, а не команда или часть shop.ts. Не добавлять shop.ts после -p: выбранный конфиг уже задаёт исходники. При вызове tsc с именами файлов в командной строке tsconfig.json игнорируется. noEmitOnError не удаляет старый dist/shop.js; после неуспешной компиляции старый файл запускать не нужно. В браузерном приложении подключают полученный .js; следующий слайд связывает это со сборкой React.', sources: ['config', 'emit', 'npx'] },
  { id: 'build-pipeline', chapter: 'why', title: 'В React проверка живёт рядом со сборкой', lead: 'Успешное преобразование .tsx ещё не означает, что типы согласованы.', cards: [['tsc --noEmit', 'Проверить проект; JavaScript-файлы не создавать.', 'ПРОВЕРКА'], ['Сборщик', 'Преобразовать TS и JSX, собрать модули и ресурсы.', 'СБОРКА'], ['Браузер', 'Выполнить получившийся JavaScript.', 'ЗАПУСК']], takeaway: 'В build-скрипте: tsc --noEmit && команда сборщика.', minutes: 1, notes: 'В конкретном React-проекте сохраняем конфигурацию его сборщика. .d.ts описывает API библиотеки для проверяющего, не является реализацией. Не переносить упрощённый tsconfig предыдущего слайда вслепую в существующий проект.', sources: ['noEmit', 'react'] },
  { id: 'inference', chapter: 'typing', title: 'Начните с вывода типов', lead: 'Для очевидного значения TS часто сам определяет тип.', code: code('primitives'), bullets: ['string, number, boolean пишутся со строчной буквы.', 'number[] – массив чисел.', 'Явная аннотация нужна там, где контракт шире начального значения.'], takeaway: 'Не требуется добавлять : number к каждому числу.', minutes: 2, notes: 'У let price выводится number. У const title строковый литерал; это подробнее понадобится в union. Аннотирование не преобразует строку в число.', sources: ['everyday'] },
  { id: 'function-types', chapter: 'typing', title: 'Функция: что получает и что возвращает', lead: 'Умножим цену на количество и выведем название в консоль.', code: code('functionsError'), exampleState: 'comparison', bullets: ['Параметры получают аннотации после имени.', 'Возвращаемый тип можно вывести или записать явно.', 'printTitle выводит текст; полезного результата у неё нет – void.'], takeaway: 'Тип функции описывает, как её можно вызвать.', minutes: 3, notes: 'Начать с total: два числа на входе, число на выходе. После скобок аннотация возвращаемого типа. Затем printTitle: принимает строку и выводит её в консоль; возвращаемого полезного значения нет. Не вводить здесь синтаксис типа callback и стрелочные функции: для первого знакомства достаточно двух обычных функций.', sources: ['everyday'] },
  { id: 'book-model', chapter: 'typing', title: 'Опишем знакомую книгу', lead: 'Один контракт используют карточка, каталог и корзина; опечатка prcie станет ошибкой.', codeColumns: [{ file: 'Тип Book · book.ts', text: bookType }, { file: 'Объект book · book.ts', text: bookValue }], combinedSnippet: 'book', takeaway: 'Book описывает форму объекта; Book[] – список таких объектов.', minutes: 2, notes: 'Каждое поле знакомо из React-API. color из прошлой демонстрации не нужен для учебной модели. type – имя для типа, а не создание объекта в памяти.', sources: ['everyday'] },
  { id: 'optional-fields', chapter: 'typing', title: 'Необязательное поле может отсутствовать', lead: 'Символ «?» в объявлении поля означает, что оно может отсутствовать.', code: code('optional'), bullets: ['Запись «subtitle?: string»: поле может отсутствовать.', 'Оператор «?.» проверяет null или undefined перед доступом.', 'Оператор «??» задаёт запасной текст.', 'readonly запрещает эту запись через тип; объект не замораживается.'], takeaway: 'Удобный контракт честно описывает отсутствие данных.', minutes: 3, notes: 'Объяснить два разных знака вопроса: объявление поля и JavaScript optional chaining. readonly – неглубокая статическая защита, Object.freeze она не вызывает.', sources: ['objects'] },
  { id: 'null', chapter: 'typing', title: '«Ещё не выбрали» – тоже состояние', lead: 'Вернёмся к пустому выбору: Book | null допускает книгу или её отсутствие.', code: code('nullable'), bullets: ['При strict null учитывается отдельно.', 'После проверки book === null остаётся Book.', 'Нельзя просто обращаться к полям возможного null.'], takeaway: 'Проверка значения уточняет его тип в текущей ветке.', minutes: 2, notes: 'Ввести знак | как «или», подробный блок о юнионах впереди. Это первый пример сужения. Уточнить, что пример функции самостоятелен, selected показывает тип состояния.', sources: ['everyday', 'narrowing'] },
  { id: 'selected-book-type', chapter: 'typing', title: 'Повторяющийся тип можно назвать', lead: 'Вынесем Book | null в SelectedBook и используем в двух местах.', code: code('selectedBook'), bullets: ['type SelectedBook = Book | null – даём типу имя.', 'Переменная и параметр используют одно описание.', 'Проверка null по-прежнему нужна перед чтением title.'], takeaway: 'Псевдоним переиспользует тип, а допустимые значения остаются прежними.', minutes: 2, notes: 'Сравнить с предыдущим слайдом: два повторения Book | null заменили на SelectedBook. Ни значение null, ни проверка в if не изменились. type не создаёт новый объект или функцию. Теперь, когда идея имени типа знакома по конкретной задаче, позже сравним type с interface.', sources: ['everyday', 'narrowing'] },
  { id: 'any-unknown', chapter: 'typing', title: 'Неизвестные данные обозначаем unknown', lead: 'any разрешает довериться данным; unknown требует сначала их проверить.', code: code('unknown'), takeaway: 'На внешней границе лучше сохранить неизвестность, чем скрыть её.', minutes: 3, notes: 'У unsafe ошибки типов нет, но это не доказательство корректности. safe сейчас специально не компилируется: guards появятся позже. strict запрещает некоторые неявные any, но не явный any.', sources: ['everyday', 'narrowing'] },
  { id: 'interface', chapter: 'contracts', title: 'interface описывает форму объекта', lead: 'Знакомая книга, только другой способ записать контракт.', code: code('interface'), bullets: ['Обязательные и необязательные поля.', 'Свойства-функции для обработчиков.', 'extends расширяет объектный контракт.'], takeaway: 'interface удобно читать как «у значения есть такие поля».', minutes: 2, notes: 'Здесь локально сокращён Book до трёх полей ради чтения. FeaturedBook должен иметь все поля Book плюс badge. Объявление интерфейса не создаёт значения и конструктора.', sources: ['objects'] },
  { id: 'type-alias', chapter: 'contracts', title: 'type может назвать любой тип', lead: 'Объект, функцию, объединение или комбинацию контрактов.', code: code('alias'), bullets: ['BookId – понятное имя для string, без новой runtime-проверки.', 'Знак | задаёт варианты.', 'Знак & требует удовлетворить обоим контрактам.'], takeaway: 'Псевдоним помогает выразить смысл, но сам по себе не создаёт новый вид строки.', minutes: 2, notes: 'Book в последней строке – контракт из book.ts. Не называть BookId номинальным типом. Пересечение несовместимых свойств может дать never; подробности не нужны, но не обещать простое слияние любых объектов.', sources: ['everyday', 'objects'] },
  { id: 'type-vs-interface', chapter: 'contracts', title: 'Оба подходят для props и объектов', lead: 'Выбирайте по задаче и сохраняйте стиль проекта.', table: { headers: ['Задача', 'type', 'interface'], rows: [['Форма объекта / props', 'Да', 'Да'], ['Union или примитив', 'Да', 'Не напрямую'], ['Расширение объекта', 'Пересечение &', 'extends']] }, takeaway: 'В этой лекции модели записываем через type; interface тоже корректен.', minutes: 2, notes: 'Сравнить только знакомые задачи: объект, имя union и расширение. Оба способа подходят для props, типы стираются из JavaScript. Внутри одного проекта сохраняем общий стиль; углублённые особенности объединения объявлений здесь не нужны.', sources: ['everyday', 'objects'] },
  { id: 'structural', chapter: 'contracts', title: 'Совместимость определяется структурой', lead: 'Функции достаточно нужных полей – название типа не обязано совпадать.', code: code('structural'), takeaway: 'Для свежего объектного литерала TS дополнительно проверяет лишние поля.', minutes: 3, notes: 'Сначала показать успешную передачу переменной с price, затем ошибку в свежем литерале. Не делать вывод, что контракт удаляет лишние поля: объект остаётся тем же.', sources: ['everyday', 'objects'] },
  { id: 'literal-union', chapter: 'unions', title: 'Union перечисляет допустимые варианты', lead: 'Статус запроса – хороший первый пример для |.', code: code('union'), bullets: ['Литералы ловят опечатки в статусах.', 'string | number разрешает два вида значения.', 'Без проверки доступны операции, подходящие всем вариантам.'], takeaway: 'Union описывает выбор варианта, а не объединяет все его возможности.', minutes: 3, notes: 'Обе ошибки намеренные. Сначала status, затем toUpperCase на number. Строка с комментарием об ошибке не является подавлением диагностики.', sources: ['everyday', 'narrowing'] },
  { id: 'state-model', chapter: 'unions', title: 'Свяжем status и данные', lead: 'Закроем риск из вступления: success требует книги, error – сообщение.', code: code('state'), takeaway: 'Один различающий признак связывает поля одного варианта.', minutes: 3, notes: 'Сравнить с тремя независимыми useState: можно случайно оставить loading и error одновременно. Это учебная модель первой загрузки. Для фонового обновления со старыми данными нужен отдельный продуманный контракт.', sources: ['narrowing'] },
  { id: 'state-demo', chapter: 'unions', title: 'Ветка определяет доступные поля', lead: 'Проследим, какие поля и интерфейс соответствуют каждому состоянию.', demo: 'state', takeaway: 'Пустой список – успешный ответ с нулём книг.', minutes: 3, notes: 'Пройти основными стрелками загрузку → ошибку → пустой ответ → книги. Обратить внимание на поле JSON и строку ветки. Невозможные сочетания не предлагаются моделью. Каждый случай имеет отдельный адрес слайда.', sources: ['narrowing'] },
  { id: 'state-narrow', chapter: 'unions', title: 'Проверяем status – получаем нужные поля', lead: 'TypeScript следует за обычным if.', code: code('narrowState'), takeaway: 'Это сужение типа, или narrowing.', minutes: 2, notes: 'В success IDE знает о books. После исключения success и error остаётся loading. Обратиться к message до проверки нельзя. Полная декларация LoadState есть на предыдущем слайде.', sources: ['narrowing'] },
  { id: 'pick-omit', chapter: 'unions', title: 'Утилиты выводят тип из существующего', lead: 'Карточка и форма создания используют разные части Book.', code: code('pickOmit'), bullets: ['Pick – оставить выбранные ключи.', 'Omit – убрать выбранные ключи.', 'При изменении Book связанные типы пересчитаются.'], takeaway: 'Утилиты работают с типами; поля реального объекта они не удаляют.', minutes: 3, notes: 'Объяснить угловые скобки здесь как передачу типа утилите; механика generics впереди. Для удаления поля в JS нужна реальная операция, например деструктуризация.', sources: ['utility'] },
  { id: 'partial-readonly', chapter: 'unions', title: 'Изменение и снимок – разные контракты', lead: 'Partial делает поля необязательными, Readonly запрещает запись через этот тип.', code: code('partial'), takeaway: 'Partial допускает пустое изменение; бизнес-правило проверяем отдельно.', minutes: 3, notes: 'id остаётся обязательным благодаря Pick с пересечением. price/title необязательны. Оба преобразования неглубокие. Readonly не вызывает Object.freeze, а Partial не гарантирует хотя бы одно поле.', sources: ['utility'] },
  { id: 'record', chapter: 'unions', title: 'Record описывает словарь корзины', lead: 'Ключ – id книги, значение – количество.', code: code('record'), takeaway: 'Тип словаря не создаёт отсутствующие ключи в объекте.', minutes: 2, notes: 'Обязательно отметить noUncheckedIndexedAccess: без него Record<string, number> может скрыть undefined при произвольном доступе. ?? 0 соответствует уже знакомой корзине.', sources: ['utility'] },
  { id: 'utility-map', chapter: 'unions', title: 'Ещё четыре утилиты – по потребности', lead: 'Не заучиваем каталог: ищем преобразование для своей задачи.', code: code('moreUtilities'), takeaway: 'Extract / Exclude выбирают варианты, NonNullable убирает null и undefined.', minutes: 2, notes: 'ReturnType извлекает возвращаемый тип функции, typeof здесь получает тип значения. Это обзор; для первого проекта достаточно Pick/Omit/Partial/Record. Не смешивать с runtime typeof, который будет в guards.', sources: ['utility'] },
  { id: 'generic-problem', chapter: 'generics', title: 'Потеряли связь между входом и выходом', lead: 'Функция подходит любому массиву, но возвращает слишком мало информации.', code: code('genericProblem'), takeaway: 'Нужно сохранить тип элемента, который передал вызывающий код.', minutes: 2, notes: 'unknown безопасен, но приходится снова проверять уже известную книгу. any уберёт проверку. Дублировать firstBook/firstNumber тоже неудобно. Здесь рождается задача для generic.', sources: ['generics'] },
  { id: 'generic', chapter: 'generics', title: 'T связывает типы одного вызова', lead: 'Дженерик – параметр типа: конкретный тип выбирается при использовании.', code: code('generic'), bullets: ['В первом вызове T – объект с title.', 'Во втором T – number.', 'Для пустого массива результат undefined.'], takeaway: 'T сохраняет связь; any её теряет.', minutes: 3, notes: 'Читать T[] как массив элементов одного выбранного типа. Возвращаемое T | undefined честно описывает пустоту. Тип часто выводится, поэтому first<Book>(books) необязательно.', sources: ['generics'] },
  { id: 'generic-demo', chapter: 'generics', title: 'Один алгоритм, разные типы', lead: 'Поменяйте тип массива или обратитесь к неверному полю.', demo: 'generic', takeaway: 'Generic не угадывает данные во время выполнения – он связывает типы при проверке.', minutes: 3, notes: 'Начать с правильного first. Нажать «Неверное поле»: цена получает обращение к title, компилятор сообщает ошибку. Можно удалить элементы массива и обсудить undefined. JS-вывод не содержит <T>.', sources: ['generics'] },
  { id: 'generic-result', chapter: 'generics', title: 'Контейнер тот же, данные разные', lead: 'Result<T> переиспользует форму результата для книги и списка.', code: code('result'), takeaway: 'Result<Book> и Result<Book[]> отличаются содержимым успешного результата.', minutes: 2, notes: 'Здесь объединяются union и generic. Название T можно заменить на Data. Promise<Book> и useState<Book[]> строятся на той же идее параметра типа. Этот контейнер сам не выполняет запрос.', sources: ['generics'] },
  { id: 'generic-constraint', chapter: 'generics', title: 'extends ограничивает допустимый T', lead: 'Поиск по id работает с любым объектом, у которого есть строковый id.', code: code('constraint'), takeaway: 'Ограничение даёт функции минимальные гарантии, сохраняя остальные поля.', minutes: 3, notes: 'Это ограничение параметра типа, не наследование runtime-класса. Сравнить результат с функцией, возвращающей только {id:string}: price потерялся бы из известного типа.', sources: ['generics'] },
  { id: 'keyof', chapter: 'generics', title: 'Ключ тоже можно связать с объектом', lead: 'keyof T – набор его ключей; T[K] – тип значения по выбранному ключу.', code: code('keyof'), takeaway: 'Нужна связь между значениями – ищите связь между их типами.', minutes: 2, notes: 'Это последний, более сложный пример раздела. Его можно оставить для самостоятельного чтения при быстром темпе. Объяснить K extends keyof T по частям и показать намеренную опечатку.', sources: ['generics'] },
  { id: 'typeof-guard', chapter: 'guards', title: 'Тайпгард – проверка, которая сужает тип', lead: 'Обычный JavaScript if даёт TypeScript новую информацию.', code: code('guard'), takeaway: 'Проверка остаётся в JS; знание о типе существует при разработке.', minutes: 2, notes: 'В if value – number, после return остаётся string. Number(value) – преобразование, typeof – проверка; это разные действия. Сам guard не обязан исправлять данные.', sources: ['narrowing'] },
  { id: 'guard-tools', chapter: 'guards', title: 'Выбираем проверку под значение', lead: 'typeof – примитивы, instanceof – экземпляры, in – наличие свойства.', code: code('guards'), takeaway: 'Проверяйте null отдельно: typeof null возвращает "object".', minutes: 2, notes: 'instanceof подходит для реальных Date/Error, а не для интерфейса Book, которого нет в JS. in сам не гарантирует тип значения поля у unknown. Array.isArray отдельно полезен для проверки массива.', sources: ['narrowing'] },
  { id: 'assertion-trap', chapter: 'guards', title: 'as – утверждение, а не проверка', lead: 'Компилятор может поверить нам и пропустить реальную ошибку.', code: code('assertion'), takeaway: 'as Book и getJSON<Book>() сами по себе не проверяют JSON.', minutes: 3, notes: 'raw содержит строковую цену. as ничего не преобразует, toFixed вызовет TypeError. Код намеренно опасен, но компилируется. Сравнить с Number(), которая реально выполняется. Не использовать подавление ошибок вместо guards.', sources: ['everyday'] },
  { id: 'custom-guard', chapter: 'guards', title: 'Свой guard проверяет обещанный контракт', lead: 'Для компактного примера проверим id, title и price.', code: code('isBook'), takeaway: 'value is Book – обещание автора. TS не доказывает полноту нашей проверки.', minutes: 4, notes: 'Book здесь намеренно сокращён: author в этом контракте нет. Все обязательные поля текущей модели проверены, дополнительно цена конечная и неотрицательная. На реальной границе контракт расширяют или используют валидатор схем. Нельзя написать return true и ожидать безопасности.', sources: ['narrowing'] },
  { id: 'guard-demo', chapter: 'guards', title: 'Один JSON проходит, другой – нет', lead: 'Измените входные данные и проверьте их до обращения к price.', demo: 'guard', takeaway: 'Диагностика TS и проверка данных во время выполнения дополняют друг друга.', minutes: 3, notes: 'Показать правильный объект, цену строкой, null, затем отрицательную цену вручную. Проверяется локальный JSON, сеть не используется. JSON.parse и isBook действительно выполняются. При ошибке не отображаем карточку.', sources: ['narrowing'] },
  { id: 'api-boundary', chapter: 'guards', title: 'Проверяем данные на входе в приложение', lead: 'После проверки getBook возвращает уже известный контракт.', code: code('boundary', 'api.ts'), takeaway: 'HTTP-успех и корректная форма JSON – две отдельные проверки.', minutes: 3, notes: 'Используется сокращённый Book и isBook с предыдущего слайда. response.json() часто приносит any, поэтому явно ставим unknown. Это фрагмент для реального проекта, презентация внешние запросы не отправляет. Promise<Book> описывает успешный результат, не тип брошенной ошибки.', sources: ['narrowing', 'everyday'] },
  { id: 'exhaustive', chapter: 'guards', title: 'never помогает не забыть новый вариант', lead: 'Если обработаны все варианты, в оставшейся ветке ничего быть не может.', code: code('never'), takeaway: 'Добавим "idle" в Status – компилятор попросит обработать его.', minutes: 2, notes: 'Предложить добавить литерал idle в тип. Присваивание never станет ошибкой. Это дополнение к базовым guards; не превращать never в отдельную сложную лекцию.', sources: ['narrowing'] },
  { id: 'react-props', chapter: 'react', title: 'Props – знакомый объект с контрактом', lead: 'Компонент остаётся функцией. JSX записываем в .tsx.', code: { file: 'BookCard.tsx', text: 'type Book = { id: string; title: string; price: number };\ntype Props = {\n  book: Book;\n  onAdd: (id: string) => void;\n};\n\nexport function BookCard({ book, onAdd }: Props) {\n  return <button onClick={() => onAdd(book.id)}>\n    {book.title} · {book.price} ₽\n  </button>;\n}' }, takeaway: 'Типы проверяют данные на границе компонента.', minutes: 3, notes: 'Отметить, что мы не учим заново React. onAdd принимает id как в State-Managers; в React-API передавали целую книгу – тип отражает выбранный контракт. Полный проверяемый пример находится в examples/BookCatalog.tsx.', sources: ['react'] },
  { id: 'react-hooks', chapter: 'react', title: 'В hooks иногда нужно подсказать тип', lead: 'Пустой массив и null не описывают все будущие значения.', code: { file: 'Catalog.tsx · фрагмент компонента', text: 'const [count, setCount] = useState(0);\nconst [books, setBooks] = useState<Book[]>([]);\nconst [selected, setSelected] = useState<Book | null>(null);\nconst [state, setState] = useState<LoadState>({\n  status: "loading"\n});\n\n// В JSX тип события выводится из <input>:\n<input onChange={event => setCount(Number(event.target.value))} />' }, takeaway: 'useState<T> – тот же параметр типа, который мы уже разобрали.', minutes: 3, notes: 'Это фрагмент тела компонента, useState импортируется из React. Извлечённому обработчику можно дать ChangeEvent<HTMLInputElement>. Number преобразует значение, но проверка конечности и допустимого диапазона – отдельное правило. count типизируется автоматически.', sources: ['react'] },
  { id: 'practice', chapter: 'react', title: 'Попробуйте типизировать свой каталог', lead: 'Двигайтесь от модели данных к компонентам и внешней границе.', cards: [['Контракт', 'Book, Book[], props карточки и onAdd.', 'ШАГ 1'], ['Варианты', 'LoadState: загрузка, успех, ошибка.', 'ШАГ 2'], ['Граница', 'unknown → проверка → Book.', 'ШАГ 3']], takeaway: 'Готово, когда tsc проходит, неверные данные отклоняются, а UI работает как раньше.', minutes: 2, notes: 'Практика после лекции: полный текст и критерии в docs/practice.md. На слайдах не подразумевается обязательная самостоятельная работа. Сначала спросить, с какой ошибки стоит начать. Не переписывать менеджеры состояния ради типов.' },
  { id: 'recap', chapter: 'react', title: 'Что теперь можно объяснить?', lead: 'Сверим исходные вопросы с результатом.', questions: [['Что делает TypeScript и что выполняет браузер?', 'TS проверяет совместимость типов; после преобразования браузер выполняет JavaScript. Проверки данных нужно написать отдельно.'], ['type, interface, union и utility – зачем?', 'Контракты объектов и функций; варианты состояния; новые типы, выведенные из существующих.'], ['Что связывает generic и что уточняет guard?', 'Generic связывает типы входа и выхода. Guard уточняет допустимый вариант по проверке значения.']], takeaway: 'Типы помогают согласовать части приложения до его запуска.', minutes: 2, notes: 'Закончить на том же магазине. Попросить объяснить разницу между as Book и isBook, а также между транспиляцией и проверкой типов. Источники доступны в заметках и docs/sources.md.', sources: ['basics', 'generics', 'narrowing'] }
];

const updatedGroups = [
  {
    "id": "unknown-narrow",
    "chapter": "typing",
    "title": "unknown становится полезным после проверки",
    "lead": "typeof проверяет реальное значение и уточняет его тип.",
    "minutes": 2,
    "takeaway": "any отключает проверку обращения; unknown требует сначала разобраться со значением.",
    "notes": "Объяснить пример на знакомом книжном магазине. any отключает проверку обращения; unknown требует сначала разобраться со значением.",
    "snippetId": "unknownNumber",
    "file": "catalog.ts",
    "bullets": [
      "До if значение неизвестно.",
      "После проверки typeof value – number.",
      "Проверка остаётся в JavaScript."
    ],
    "sources": [
      "narrowing"
    ]
  },
  {
    "id": "extend-model",
    "chapter": "contracts",
    "title": "Расширим книгу дополнительным полем",
    "lead": "Два способа получить Book с обязательным badge.",
    "minutes": 3,
    "takeaway": "В расширенном контракте остаются все поля Book и добавляется badge.",
    "notes": "Слева interface FeaturedBook extends Book, справа type FeaturedBook = Book & {...}. Оба примера используют Book из предыдущего раздела. Это расширение формы данных, а не создание класса или копии объекта. Не вводить конфликтующие пересечения и declaration merging.",
    "columnSnippets": [
      "extendInterface",
      "extendType"
    ],
    "sources": [
      "objects"
    ]
  },
  {
    "id": "literal-union",
    "chapter": "unions",
    "title": "Перечислим допустимые статусы",
    "lead": "Статус загрузки – одна строка из известных вариантов.",
    "minutes": 2,
    "takeaway": "Строковые литералы соединяем знаком | – «или».",
    "notes": "Объяснить пример на знакомом книжном магазине. Строковые литералы соединяем знаком | – «или».",
    "snippetId": "simpleStatusError",
    "file": "catalog.ts",
    "sources": [
      "everyday"
    ]
  },
  {
    "id": "union-check",
    "chapter": "unions",
    "title": "Если вариантов два – уточним нужный",
    "lead": "Идентификатор допускает строку или число.",
    "minutes": 3,
    "takeaway": "typeof помогает выбрать операцию, которая подходит текущему значению.",
    "notes": "Объяснить пример на знакомом книжном магазине. typeof помогает выбрать операцию, которая подходит текущему значению.",
    "snippetId": "simpleUnionError",
    "file": "catalog.ts",
    "sources": [
      "narrowing"
    ]
  },
  {
    "id": "pick-fields",
    "chapter": "utilities",
    "title": "Pick: возьмём поля для карточки",
    "lead": "Короткой карточке нужны id, title и price.",
    "minutes": 3,
    "takeaway": "Pick создаёт тип выбранных полей. Данные объекта он не копирует.",
    "notes": "Объяснить пример на знакомом книжном магазине. Pick создаёт тип выбранных полей. Данные объекта он не копирует.",
    "snippetId": "pick",
    "file": "catalog.ts",
    "sources": [
      "utility"
    ]
  },
  {
    "id": "omit-fields",
    "chapter": "utilities",
    "title": "Omit: опишем книгу без id",
    "lead": "Форма создания ещё не знает id, который выдаст сервер.",
    "minutes": 3,
    "takeaway": "Omit убирает ключ из типа; из существующего объекта поле не удаляется.",
    "notes": "Объяснить пример на знакомом книжном магазине. Omit убирает ключ из типа; из существующего объекта поле не удаляется.",
    "snippetId": "omit",
    "file": "catalog.ts",
    "sources": [
      "utility"
    ]
  },
  {
    "id": "react-start",
    "chapter": "react",
    "title": "Подключаем типы к знакомому React-проекту",
    "lead": "JSX переносим в .tsx; обычные модули – в .ts.",
    "minutes": 1,
    "takeaway": "Шаблон React + TS обычно уже подготовил эти настройки.",
    "notes": "На слайде перечислены зависимости, а не универсальная команда изменения проекта. Использовать настройки его сборщика: упрощённый конфиг shop.ts не переносим целиком в React. Типы React приходят из @types, а JSX поддерживает TypeScript.",
    "bullets": [
      "Установить typescript, @types/react и @types/react-dom.",
      "В конфигурации сборщика включить поддержку TS и JSX.",
      "В React-конфиге нужны DOM-типы и настройка jsx.",
      "Проверять типы отдельно: tsc --noEmit."
    ],
    "sources": [
      "react",
      "noEmit"
    ]
  },
  {
    "id": "react-props",
    "chapter": "react",
    "title": "Props – обычный объект с типом",
    "lead": "Book уже описан: используем его в карточке.",
    "minutes": 2,
    "takeaway": "Не нужно отдельно аннотировать каждое поле внутри компонента.",
    "notes": "Book импортируется из модели. React выводит возвращаемый тип компонента; React.FC и явный тип JSX-результата здесь не требуются. Тип Props описывает входные данные компонента.",
    "snippetId": "reactProps",
    "file": "BookCard.tsx",
    "sources": [
      "react"
    ]
  },
  {
    "id": "react-callback",
    "chapter": "react",
    "title": "Типизируем действие «добавить в корзину»",
    "lead": "onAdd получает строковый id книги.",
    "minutes": 3,
    "takeaway": "Тип функции описывает аргументы, которые компонент может передать родителю.",
    "notes": "Прочитать (id: string) => void как «получает строку, вызывающий не использует результат». В onClick передаётся функция. На следующем слайде book.price вместо book.id нарушит этот контракт.",
    "snippetId": "reactCallbackError",
    "file": "AddButton.tsx",
    "sources": [
      "react",
      "everyday"
    ]
  },
  {
    "id": "react-hooks",
    "chapter": "react",
    "title": "useState часто выводит тип сам",
    "lead": "Число и строка уже описывают будущие значения состояния.",
    "minutes": 3,
    "takeaway": "useState(0) даёт number, а setter проверяет новое значение.",
    "notes": "Пример расположен в теле компонента. Вызовы setter находятся внутри reset, а не при рендере. Не требуется useState<number>(0): первоначальное число достаточно информативно.",
    "snippetId": "reactStateError",
    "file": "Counter.tsx · внутри компонента",
    "sources": [
      "react"
    ]
  },
  {
    "id": "react-collections",
    "chapter": "react",
    "title": "Для пустого массива и null подскажем тип",
    "lead": "Начального значения недостаточно, чтобы описать будущую книгу.",
    "minutes": 2,
    "takeaway": "useState<Book[]> и useState<Book | null> – применение готового дженерика.",
    "notes": "Угловые скобки передают тип готовому хуку. Здесь не пишем собственную generic-функцию: учимся читать API библиотеки. Book[] допускает пустой массив, Book | null – отсутствие выбранной книги.",
    "snippetId": "reactCollections",
    "file": "Catalog.tsx · внутри компонента",
    "sources": [
      "react"
    ]
  },
  {
    "id": "react-status",
    "chapter": "react",
    "title": "Применим union к состоянию загрузки",
    "lead": "Используем тот же Status, который уже разобрали.",
    "minutes": 2,
    "takeaway": "Статус по-прежнему строка, но набор допустимых строк ограничен.",
    "notes": "Объяснить пример на знакомом книжном магазине. Статус по-прежнему строка, но набор допустимых строк ограничен.",
    "snippetId": "reactStatusError",
    "file": "Catalog.tsx · внутри компонента",
    "sources": [
      "react"
    ]
  },
  {
    "id": "react-inline-event",
    "chapter": "react",
    "title": "В JSX тип события обычно уже известен",
    "lead": "React знает, что обработчик относится к input.",
    "minutes": 1,
    "takeaway": "Наведите на event в редакторе: тип часто можно получить без ручной аннотации.",
    "notes": "Объяснить пример на знакомом книжном магазине. Наведите на event в редакторе: тип часто можно получить без ручной аннотации.",
    "snippetId": "reactInlineEvent",
    "file": "PriceInput.tsx",
    "sources": [
      "react"
    ]
  },
  {
    "id": "react-event",
    "chapter": "react",
    "title": "Вынесенному обработчику дадим готовый тип",
    "lead": "ChangeEvent импортируем из react; HTMLInputElement уже есть в TypeScript.",
    "minutes": 2,
    "takeaway": "Даже у input type=\"number\" значение поля читается как строка.",
    "notes": "ChangeEvent импортируется через import type из react. HTMLInputElement – готовый DOM-тип TypeScript. currentTarget указывает на input, для которого установлен обработчик. Пустая строка – нормальный черновик формы.",
    "snippetId": "reactEvent",
    "file": "PriceInput.tsx",
    "sources": [
      "react"
    ]
  },
  {
    "id": "react-submit",
    "chapter": "react",
    "title": "Перед сохранением проверим цену",
    "lead": "Тип события не превращает строку из input в число.",
    "minutes": 3,
    "takeaway": "Number и проверка диапазона выполняются в JavaScript; TS их не заменяет.",
    "notes": "FormEvent<HTMLFormElement> – тип события отправки. preventDefault отменяет переход страницы. Проверить пустую строку до Number, затем конечность и неотрицательность. console.log обозначает место вызова сохранения; полноценный локальный редактор будет в демо.",
    "snippetId": "reactSubmit",
    "file": "PriceForm.tsx",
    "sources": [
      "react"
    ]
  },
  {
    "id": "react-ready-types",
    "chapter": "react",
    "title": "Готовые типы ищем у библиотеки",
    "lead": "Описания DOM и React уже доступны – их не нужно писать заново.",
    "minutes": 1,
    "takeaway": "Для сторонней библиотеки сначала проверяем её экспортируемые типы и документацию.",
    "notes": "DOM-типы вроде HTMLInputElement входят в lib.dom TypeScript. ChangeEvent, ReactNode и ComponentProps приходят из @types/react. Многие библиотеки поставляют .d.ts вместе с пакетом; @types нужен там, где отдельные описания действительно отсутствуют. Не предлагать any как замену изучению API.",
    "cards": [
      [
        "DOM",
        "HTMLInputElement для поля события.",
        "TYPESCRIPT"
      ],
      [
        "События",
        "ChangeEvent импортируем из react.",
        "REACT"
      ],
      [
        "Props",
        "ReactNode и ComponentProps импортируем из react.",
        "REACT"
      ]
    ],
    "sources": [
      "react"
    ]
  },
  {
    "id": "react-children",
    "chapter": "react",
    "title": "ReactNode описывает содержимое children",
    "lead": "ReactNode импортируем из react: он описывает текст и JSX.",
    "minutes": 2,
    "takeaway": "Готовый ReactNode покрывает значения, которые React может отрисовать.",
    "notes": "ReactNode импортируется через import type. Не пытаться свести children только к string или одному JSX-элементу. Панель – знакомая композиция компонентов; обширное сравнение ReactElement здесь не требуется.",
    "snippetId": "reactChildren",
    "file": "Panel.tsx",
    "sources": [
      "react"
    ]
  },
  {
    "id": "react-button",
    "chapter": "react",
    "title": "ComponentProps переиспользует props кнопки",
    "lead": "ComponentProps импортируем из react и получаем готовые props кнопки.",
    "minutes": 2,
    "takeaway": "Переиспользуем контракт стандартного элемента вместо ручного списка атрибутов.",
    "notes": "ComponentProps импортируется через import type из react. Угловые скобки содержат строковый литерал button, выбирающий элемент. Не переписывать тип onClick вручную. Пример не занимается ref: продвинутые варианты ComponentPropsWithRef можно оставить за рамками.",
    "snippetId": "reactButton",
    "file": "SaveButton.tsx",
    "sources": [
      "react"
    ]
  },
  {
    "id": "react-ref",
    "chapter": "react",
    "title": "useRef: подскажем, на какой элемент ссылаемся",
    "lead": "Поле появится после рендера, поэтому начальное значение – null.",
    "minutes": 2,
    "takeaway": "HTMLInputElement даёт подсказки focus; ?. учитывает возможный null.",
    "notes": "useRef<HTMLInputElement>(null) вызывается на верхнем уровне компонента. current читаем внутри обработчика клика. Не вводить useRef как новую систему состояния: здесь только тип ссылки на уже знакомый input.",
    "snippetId": "reactRef",
    "file": "PriceInput.tsx",
    "sources": [
      "react",
      "ref"
    ]
  },
  {
    "id": "react-effect",
    "chapter": "react",
    "title": "useEffect не требует параметра типа",
    "lead": "Типизируем данные title; эффект и cleanup проверяются автоматически.",
    "minutes": 2,
    "takeaway": "Функция эффекта возвращает cleanup или ничего. async-эффект напрямую не передаём.",
    "notes": "Пример синхронизирует document.title и восстанавливает прежний заголовок. Зависимость title указана. Для запроса async-функцию вызывают внутри эффекта, а не делают сам callback async. Сегодня цель – понять границу типов, не повторить весь useEffect.",
    "snippetId": "reactEffect",
    "file": "PageTitle.tsx",
    "sources": [
      "react",
      "effect"
    ]
  },
  {
    "id": "react-hook",
    "chapter": "react",
    "title": "Свой хук – функция с понятным результатом",
    "lead": "Назовём объект, который возвращает useSelectedBook.",
    "minutes": 3,
    "takeaway": "Компонент получает selected и select с уже известными типами.",
    "notes": "Хук использует обычный именованный тип Selection и useState. selected может быть null, select принимает Book. Явный возвращаемый тип полезен на публичной границе хука, но TS мог бы вывести его. Внутри возвращаемого обработчика параметр book выводится из Selection.",
    "snippetId": "reactHook",
    "file": "useSelectedBook.ts",
    "sources": [
      "react"
    ]
  },
  {
    "id": "react-promise",
    "chapter": "react",
    "title": "Promise<Book[]> описывает результат после await",
    "lead": "Promise не требует импорта. Пример API-клиента ниже – локальная модель без сети.",
    "minutes": 2,
    "takeaway": "Тип результата запроса не проверяет внешний JSON автоматически.",
    "notes": "На этот слайд оставляем две минуты. Прочитать async getBooks как Promise<Book[]>, затем await как получение Book[]. Ошибку запроса обрабатывают через try/catch; Promise<Book[]> не задаёт её тип. Локальная async-функция возвращает уже известный Book[]. В настоящем fetch ответ JSON нужно проверить на границе приложения, например валидатором схемы. Promise<Book[]> описывает успешное значение после await, а не тип исключения. Подробный пользовательский guard вынесен в дополнение.",
    "snippetId": "reactPromise",
    "file": "api/books.ts",
    "sources": [
      "everyday",
      "react"
    ]
  },
].map(({ snippetId, file, columnSnippets, ...slide }) => ({
  ...slide,
  ...(snippetId ? { code: code(snippetId, file) } : {}),
  ...(columnSnippets ? { codeColumns: columnSnippets.map((id, index) => code(id, index === 0 ? 'interface + extends' : 'type + &')) } : {})
}));

const reviewedGroups = [
  {
    id: 'react-generics', chapter: 'generics', title: 'Дженерик сохраняет тип переданного значения',
    lead: 'Одна функция превращает значение в массив, сохраняя тип его элемента.',
    code: code('genericIntro', 'toArray.ts'), minutes: 2,
    bullets: ['T – параметр типа, который используем внутри описания функции.', 'Передали string: value – строка, результат T[] – массив строк.', 'Передали number: получим массив чисел.'],
    takeaway: 'Одна реализация работает с разными типами и сохраняет связь между входом и результатом.',
    notes: 'На дженерики оставляем две минуты. Задача: обернуть одно значение в массив без потери его типа. Сначала прочитать toArray<string>: T становится string и в параметре, и в результате string[]. Затем заменить выбранный тип на number для второго вызова. Имя T условное; это параметр типа, а не значение JavaScript. Явные <string> и <number> здесь нужны для первого знакомства: в обоих вызовах TypeScript может вывести тип из аргумента. Угловые скобки передают тип, круглые – значение. В React тот же приём встретится у useState<Book[]>; сам хук здесь не разбираем.',
    sources: ['generics']
  },
  {
    id: 'compiler-demo', chapter: 'why', title: 'Компилятор: верный и неверный вызов',
    lead: 'Одинаковая функция. Разница только в аргументе.', minutes: 3,
    codeColumns: [
      { ...code('priceFixed', 'Верный вызов · shop.ts'), state: 'success' },
      { ...code('price', 'Неверный вызов · shop.ts'), state: 'error' }
    ],
    takeaway: 'Справа TypeScript отмечает строку вместо числа ещё до запуска программы.',
    notes: 'Статичное сравнение без полей ввода и кнопок. Сначала прочитать левый вызов с числом, затем правый со строкой и настоящую диагностику TS2345. Следующий слайд показывает получившийся JavaScript.',
    sources: ['basics']
  },
  {
    id: 'compiler-output', chapter: 'why', title: 'После компиляции получаем JavaScript',
    lead: 'Тот же shop.ts: слева исходник, справа настоящий результат tsc.', minutes: 1,
    codeColumns: [code('standalone', 'shop.ts'), { file: 'shop.js', emittedFrom: 'standalone' }],
    takeaway: 'Аннотации number исчезли. Функция и вызов console.log остались.',
    notes: 'Правый код получен локальным TypeScript при сборке лекции, а не написан вручную. Показать исчезновение аннотаций и сохранение операций. Это исходник для минимального запуска на следующих слайдах. target здесь ES2022; не обещать полифиллы браузерных API.',
    sources: ['basics']
  },
  {
    id: 'tsc-setup', chapter: 'why', title: 'Создадим проект и файл shop.ts',
    lead: 'Выполняем действие и смотрим, что появилось в папке.', minutes: 0.5,
    table: { headers: ['Действие', 'Что произойдёт'], rows: [
      ['npm init -y', 'Появится package.json с описанием npm-проекта.'],
      ['npm install -D typescript', 'Установится локальный tsc; TypeScript добавится в devDependencies.'],
      ['Создать shop.ts', 'В нём сохранится программа с предыдущего слайда.'],
      ['Создать рядом tsconfig.json', 'В нём сохраним настройки проверки и выпуска JS.']
    ] },
    takeaway: 'Файлы уже созданы, но JavaScript появится только после запуска tsc.',
    notes: 'Работать в отдельной пустой папке с Node.js и npm. После установки также появятся node_modules и package-lock.json. Команда npm init не создаёт shop.ts и tsconfig.json: их создаём вручную. Содержимое программы показано на предыдущем слайде; назначение и содержимое конфига разберём далее.',
    sources: ['config']
  },
  {
    id: 'any-intro', chapter: 'typing', title: 'any: используем значение без проверки типов',
    lead: 'TypeScript разрешает обращения, даже когда форма значения не описана.',
    code: code('anyIntro'), minutes: 1,
    bullets: ['Можно читать price и вызывать toFixed без подтверждения типов.', 'Компилятор доверяет такому обращению.', 'Если при запуске придёт другое значение, программа может упасть.'],
    takeaway: 'any не проверяет данные и не делает их безопасными.',
    notes: 'Здесь пример работает с правильным объектом. Если price окажется строкой, toFixed упадёт при выполнении. Не помечать это как статическую ошибку TS: any отключил проверку использования значения. На следующем слайде unknown позволит сохранить неизвестность.',
    sources: ['everyday']
  },
  {
    id: 'any-unknown', chapter: 'typing', title: 'Неизвестные данные обозначаем unknown',
    lead: 'Значение есть, но его тип и форму мы пока не подтвердили.',
    code: code('unknownIntro'), minutes: 1,
    bullets: ['unknown может хранить число, строку, объект или null.', 'Передать значение дальше можно.', 'Перед чтением полей или вызовом методов нужна проверка.'],
    takeaway: 'unknown честно сообщает: «сначала выясни, что это за значение».',
    notes: 'В отличие от any, неизвестное значение не разрешает произвольные операции. Пока показываем только хранение разных значений; на следующем слайде сравним одно и то же обращение к price у any и unknown.',
    sources: ['everyday','narrowing']
  },
  {
    id: 'any-unknown-comparison', chapter: 'typing', title: 'Разница any и unknown',
    lead: 'Одинаковое обращение к price проверяется по-разному.',
    code: code('unknown'), exampleState: 'comparison', combineCases: true, minutes: 1,
    takeaway: 'any разрешает обращение. unknown требует сначала проверить значение.',
    notes: 'В unsafe параметр any: чтение price разрешено без проверки. В safe параметр unknown: TS18046 останавливает чтение поля. Это перенесённый пример «у unknown нельзя сразу читать price»; отдельный повторяющийся слайд не нужен. Следующий слайд показывает простую проверку typeof.',
    sources: ['everyday','narrowing']
  }
];

const groupsById = new Map([...originalGroups, ...updatedGroups, ...reviewedGroups].map(slide => [slide.id, slide]));
const mainIds = ["cover", "already-know", "delivery-task", "price-problem", "failure-cases", "what-is-ts", "compiler-path", "compiler-output", "tsc-setup", "tsconfig-purpose", "tsc-config", "tsc-run", "build-pipeline", "inference", "function-types", "book-model", "optional-fields", "null", "selected-book-type", "any-intro", "any-unknown", "any-unknown-comparison", "unknown-narrow", "interface", "extend-model", "type-vs-interface", "literal-union", "union-check", "pick-fields", "omit-fields", "record", "react-generics", "react-start", "react-props", "react-callback", "react-hooks", "react-collections", "react-status", "react-inline-event", "react-event", "react-ready-types", "react-children", "react-button", "react-promise"];
// Основной рассказ: 68 минут; ещё 5 минут оставляем на вопросы.
const minuteOverrides = {
  'delivery-task': 1, 'failure-cases': 1, 'what-is-ts': 1,
  'compiler-path': 2, 'function-types': 2, 'optional-fields': 2,
  'selected-book-type': 1, 'any-intro': 1, 'any-unknown': 1,
  'any-unknown-comparison': 1, 'extend-model': 2, 'type-vs-interface': 1,
  'union-check': 2, 'pick-fields': 2, 'omit-fields': 2, record: 2,
  'react-callback': 2
};
const slideGroups = mainIds.map(id => ({ ...groupsById.get(id), ...(id in minuteOverrides ? { minutes: minuteOverrides[id] } : {}), ...(id === 'record' ? { chapter: 'utilities' } : {}) }));
export const extraSlides = [
  ...originalGroups.filter(slide => !mainIds.includes(slide.id) && !['practice', 'recap', 'type-alias', 'compiler-demo'].includes(slide.id)),
  ...['react-ref', 'react-effect', 'react-hook'].map(id => groupsById.get(id))
];

// Последовательные объяснения входят в общий маршрут, без вложенной навигации.
const routeSlides = slideGroups.flatMap(slide => {
  if (slide.steps) {
    const ids = ['compiler-path', 'compiler-check', 'compiler-transform', 'compiler-run'];
    return slide.steps.map(([label, value], activeStep) => ({
      ...slide,
      id: ids[activeStep],
      title: `${label}: ${value}`,
      activeStep,
      minutes: slide.minutes / slide.steps.length
    }));
  }
  if (slide.questions) {
    const { questions, ...base } = slide;
    const minutes = slide.minutes / (questions.length + 1);
    return [
      { ...base, questionList: questions.map(([question]) => question), minutes },
      ...questions.map(([question, answer], index) => ({
        ...base,
        id: `${slide.id}-answer-${index + 1}`,
        title: question,
        lead: `Разбираем ответ ${index + 1} из ${questions.length}.`,
        answer,
        minutes
      }))
    ];
  }
  if (slide.demo === 'state') {
    const cases = [
      ['loading', 'Загружаем каталог', 'Доступен только status: данных и ошибки пока нет.'],
      ['error', 'Запрос завершился ошибкой', 'В этой ветке есть message; списка книг нет.'],
      ['empty', 'Пришёл пустой список', 'Это успешный ответ: books существует и содержит ноль книг.'],
      ['success', 'Пришли книги', 'В успешной ветке можно читать books и показывать каталог.']
    ];
    return cases.map(([stateCase, title, lead], index) => ({
      ...slide,
      id: index === 0 ? slide.id : `${slide.id}-${stateCase}`,
      stateCase,
      title,
      lead,
      minutes: slide.minutes / cases.length
    }));
  }
  return [slide];
});
export const slides = routeSlides.flatMap(slide => {
  if (slide.id === 'price-problem') {
    const body = slide.code.text.split('\n\n')[0];
    return [
      { ...slide, title: 'Доставка: число даёт ожидаемый результат', lead: 'Корзина передаёт цену числом: 690 + 100 = 790.', code: { ...slide.code, text: body + '\n\naddDelivery(690); // 790' }, exampleState: 'javascript-success', bullets: ['На входе число 690.', 'JavaScript выполняет сложение.', 'На выходе ожидаемое число 790.'], takeaway: 'Сначала проверим обычный рабочий вызов.', minutes: slide.minutes / 2 },
      { ...slide, id: 'price-problem-error', exampleState: 'javascript-result', code: { ...slide.code, text: body + '\n\naddDelivery("690");', runtimeDiagnostic: { code: 'Результат JavaScript', kind: 'result', line: 5, character: 1, length: 18, message: '"690100" вместо 790: оператор + склеил строки.' } }, minutes: slide.minutes / 2 }
    ];
  }
  const pair = slide.combineCases ? null : examplePairs[slide.code?.snippet];
  if (!pair) return [slide];
  const minutes = slide.minutes / 2;
  return [
    { ...slide, code: code(pair.valid, slide.code.file), exampleState: 'success', title: pair.successTitle || slide.title, takeaway: pair.successTakeaway || slide.takeaway, minutes },
    { ...slide, id: `${slide.id}-error`, code: { ...slide.code, runtimeDiagnostic: pair.diagnostic }, exampleState: pair.runtime ? 'runtime-error' : 'error', title: pair.errorTitle, lead: pair.errorLead, takeaway: pair.errorTakeaway, minutes }
  ];
});
export const totalMinutes = slides.reduce((sum, slide) => sum + slide.minutes, 0);
