export const examplePairs = {
  simpleStatusError: {
    valid: 'simpleStatus',
    errorTitle: 'Опечатка не входит в допустимые статусы',
    errorLead: 'Меняем success на succes.',
    errorTakeaway: 'Union позволяет заранее перечислить допустимые значения.'
  },
  simpleUnionError: {
    valid: 'simpleUnion',
    errorTitle: 'У числа нет toUpperCase',
    errorLead: 'Убрали проверку typeof, но аргумент всё ещё может быть числом.',
    errorTakeaway: 'Сначала уточняем вариант, затем вызываем его методы.'
  },
  reactCallbackError: {
    valid: 'reactCallback',
    errorTitle: 'Обработчик ждёт id, а получил цену',
    errorLead: 'В JSX тот же контракт функции: onAdd принимает строку.',
    errorTakeaway: 'Тип props обнаруживает ошибку внутри компонента.'
  },
  reactStateError: {
    valid: 'reactState',
    errorTitle: 'setCount тоже ожидает число',
    errorLead: 'useState(0) определил тип состояния и его setter.',
    errorTakeaway: 'Для очевидного начального значения явный параметр типа не нужен.'
  },
  reactStatusError: {
    valid: 'reactStatus',
    errorTitle: 'Union защищает и состояние React',
    errorLead: 'Пытаемся сохранить несуществующий статус succes.',
    errorTakeaway: 'useState<Status> принимает только значения из нашего union.'
  },
  price: {
    valid: 'priceFixed',
    errorTitle: 'Строка нарушает контракт функции',
    errorLead: 'Меняем только аргумент: вместо числа передаём строку.',
    errorTakeaway: 'Ошибка видна до запуска: addDelivery принимает number.'
  },
  primitives: {
    valid: 'primitivesFixed',
    errorTitle: 'Выведенный number тоже защищает от строки',
    errorLead: 'Начальное значение осталось числом, а новое присваивание стало строкой.',
    errorTakeaway: 'Выведенный тип проверяется так же, как явно записанный.'
  },
  unknown: {
    valid: 'unknownFixed',
    errorTitle: 'У unknown нельзя сразу читать price',
    errorLead: 'Добавляем обращение к полю, о котором пока ничего не знаем.',
    errorTakeaway: 'Перед чтением поля неизвестное значение нужно проверить.'
  },
  structural: {
    valid: 'structuralFixed',
    successTakeaway: 'showTitle(book) проходит: у переменной есть нужное поле title: string.',
    errorTitle: 'У свежего объекта проверяются лишние поля',
    errorLead: 'Теперь записываем объект прямо в вызове showTitle.',
    errorTakeaway: 'Здесь ошибка в price у литерала; предыдущий showTitle(book) остаётся корректным.'
  },
  union: {
    valid: 'unionFixed',
    errorTitle: 'Опечатка и неверная операция нарушают union',
    errorLead: 'Портим статус и убираем преобразование id в строку.',
    errorTakeaway: 'Нужен допустимый статус и операция, подходящая текущему типу значения.'
  },
  partial: {
    valid: 'partialFixed',
    errorTitle: 'Readonly разрешает чтение, но запрещает запись',
    errorLead: 'Пытаемся изменить цену через тип Readonly<Book>.',
    errorTakeaway: 'Компилятор отмечает присваивание; объект при этом не замораживается.'
  },
  genericProblem: {
    valid: 'genericProblemFixed',
    errorTitle: 'Тип результата unknown не даёт читать title',
    errorLead: 'После допустимого вызова пытаемся использовать результат как книгу.',
    errorTakeaway: 'Нужна связь с типом входа – на следующем слайде сохраним её через T.'
  },
  keyof: {
    valid: 'keyofFixed',
    errorTitle: 'keyof ловит опечатку в ключе',
    errorLead: 'Передаём prcie вместо существующего ключа price.',
    errorTakeaway: 'Ключ должен принадлежать объекту, переданному в этот вызов.'
  },
  assertion: {
    valid: 'assertionFixed',
    runtime: true,
    diagnostic: { code: 'TypeError', line: 3, character: 1, length: 20, message: 'book.price.toFixed is not a function' },
    successTitle: 'as не мешает коду работать с верными данными',
    successTakeaway: 'С числовой ценой вызов работает. Но as не проверял входные данные.',
    errorTitle: 'as пропустит строковую цену и ошибку при запуске',
    errorLead: 'TypeScript не сообщает об ошибке; JavaScript падает на toFixed.',
    errorTakeaway: 'Красное сообщение здесь – TypeError при выполнении, а не диагностика TypeScript.'
  }
};
