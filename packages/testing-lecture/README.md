# Unit и e2e: проверяем обещания магазина

[Открыть лекцию](https://ngg-dev.github.io/lecture-frontend/lectures/testing-lecture/) · [Весь курс](../../)

Продолжение React/TypeScript-курса. Сохраняем книжный магазин: «Солярис», цена, форма, корзина. Сначала работающий проект, затем конкретная регрессия, затем минимальный инструмент, который её обнаруживает. Никакого списка библиотек до появления задачи.

**Результат:** студент различает unit, компонентную/интеграционную и браузерную проверку; пишет Jest-тест правила, Testing Library-тест взаимодействия и Playwright-сценарий; умеет показать красный тест и объяснить границу mock.

## Маршрут

- Есть магазин → пустая цена стала нулём → типы не спасли → ручной чек-лист перестал масштабироваться.
- Unit: контракт, Jest, Arrange–Act–Assert, красный тест, исправление, границы, matcher-ы. Живое сравнение ошибочной и правильной функции.
- Компонент: функция зелёная, кнопка не работает → jsdom, Testing Library, user-event, доступные запросы, async, отказ и повтор.
- Браузер: компоненты отдельно зелёные, связи сломаны → Playwright, критический путь, auto-wait, контролируемый API, изоляция, trace.
- Стратегия: выбор уровня по риску, ограничения coverage, практика, маршрут CI и самопроверка.

**40 слайдов, 77 минут рассказа + 20 минут практики.** Числа вычисляются из `src/content.js` и видны на обложке; план преподавателя — `public/docs/speaker-guide.md`.

Предпосылки: функции, массивы, async/await, React props/state/events, базовый TypeScript; см. `public/docs/prior-knowledge.md`. Новые инструменты вводятся с нуля. Работа с реальным backend, БД, платёжным сервисом и проценты покрытия не требуются.

## Запуск независимого пакета

Нужны Node.js **22.12+**, npm и Python 3 для просмотра сборки. Зависимости и версии зафиксированы в локальном lockfile.

```sh
# Из корня монорепозитория:
cd packages/testing-lecture
npm ci
npm run check
npm run build
npm run dev
```

Dev: <http://127.0.0.1:4192/>. Магазин: <http://127.0.0.1:4192/shop/>. `npm run dev` — разработка с обновлением; Pages публикует именно сборку, а не dev-сервер.

```sh
npm test              # Jest, один запуск
npm run test:watch    # Jest, watch
npm run check        # tsc + Jest + проверки маршрута и ссылок
```

## Как Jest исполняет TS/TSX

Jest для unit и компонентных тестов, Playwright для e2e — выбранный стек лекции. Testing Library помогает проверять React внутри Jest, не заменяет runner.

Сборка Vite не передаёт свою конфигурацию в Jest. Если добавляете тесты в собственный проект, установите:

```sh
npm install -D jest @jest/globals @types/jest jest-environment-jsdom \
  babel-jest @babel/core@7 @babel/preset-env@7 \
  @babel/preset-react@7 @babel/preset-typescript@7
npm install -D @testing-library/react @testing-library/dom \
  @testing-library/user-event @testing-library/jest-dom
```

- `jest.config.cjs`: `testMatch` ограничивает Jest папкой `tests/`, `transform` передаёт TS/TSX в `babel-jest`; `testEnvironment: 'jsdom'` даёт DOM; `setupFilesAfterEnv` подключает matcher-ы и cleanup.
- `babel.config.cjs`: preset-env преобразует модули для текущего Node, preset-react — JSX, preset-typescript убирает аннотации. **Babel не проверяет типы**: для этого `tsc --noEmit` в `npm run check`.
- `.cjs` позволяет использовать `module.exports` при `type: module`. Тесты импортируют `test`, `expect`, `jest` из `@jest/globals`; setup использует `@testing-library/jest-dom/jest-globals`.
- `jest --runInBand` — один запуск последовательно; `jest --watchAll` — наблюдение за изменениями. Команды Playwright не менялись.

Для готового пакета повторять установку отдельных библиотек не нужно: **`npm ci`** использует зафиксированные версии.

## Проверка собранного сайта под префиксом Pages

Первый терминал, **из корня монорепозитория**:

```sh
npm run build
python3 -m http.server 4193 --bind 127.0.0.1 --directory ..
```

Второй терминал, **из корня монорепозитория**:

```sh
cd packages/testing-lecture
npx playwright install chromium
npm run test:e2e
```

Открывается <http://127.0.0.1:4193/lecture-frontend/lectures/testing-lecture/>. Команда предполагает стандартное имя каталога `lecture-frontend`. Если оно другое, укажите фактический URL через `LECTURE_BASE_URL` с завершающим `/`. Linux без системных библиотек: `npx playwright install --with-deps chromium` (может потребовать права администратора).

Для проверки dev вместо сборки:

```sh
LECTURE_BASE_URL=http://127.0.0.1:4192/ npm run test:e2e
```

Браузерные тесты не поднимают HTTP-сервер автоматически: проверьте его запуск до выполнения. `npm run test:e2e -- --headed` показывает браузер; `--debug` включает отладчик. При падении сохраняются screenshot и trace в `test-results/`, retries выключены. `test:e2e:ui` предназначен для локальной машины с графическим окружением.

## Управление

- ← →, Page Up/Down, пробел (Shift — назад), Home/End — слайды.
- O — оглавление; Escape — закрыть. F — полный экран, если разрешён браузером.
- N — заметки преподавателя. Есть кнопки всех основных действий.
- Каждый слайд имеет постоянный hash; прямая ссылка и reload сохраняют слайд.
- Поля, select, кнопки, ссылки, код и демо не перехватываются глобальной навигацией.
- На узком экране слайд прокручивается вертикально, длинный код — внутри своего блока.

## Что действительно выполняется

- `src/shop/model.ts` — настоящий парсер, используется и в React, и на слайде `#green`.
- `tests/model.test.ts` — unit; `tests/PriceEditor.test.tsx` — настоящий React + DOM и контролируемый callback.
- `src/shop/PriceEditor.tsx` — общий компонент магазина и интерактивного слайда.
- `shop/` — собранное React-приложение с локальной корзиной и ценой. Reload сбрасывает данные.
- `e2e/shop.spec.ts` — браузерный путь корзины; отдельно отказ/повтор API через `page.route`.
- `e2e/deck.spec.ts` — реальное управление декой, hash/reload, демо, ввод и узкий экран.
- `#unit-lab` — учебная мини-проверка реальных вызовов функции **в браузере, не Jest**. Никаких вымышленных отчётов runner-а.
- `shop/?mode=api` используется тестом с перехватом GET/PATCH. На Pages нет API: самостоятельно этот режим показывает ошибку загрузки. Обычный `/shop/` работает автономно.

**Граница:** браузер + mock API — проверка фронтенда, не полного backend e2e. Полный e2e требует отдельного тестового сервера, изолированных данных и БД. Не направляйте эти тесты на production.

## Практика и решение

Сначала [условие](public/docs/practice.md); затем [сверка с эталоном](public/docs/solution.md). Продолжайте собственный проект, не копируйте готовый магазин вместо него. Материалы находятся в `public/docs/` и при сборке попадают в `dist/docs/` без внешних зависимостей.

`src/content.js` — слайды и тайминги; `src/main.jsx` — оболочка в визуальном стиле TS-лекции: синяя чертёжная сетка, контурные панели, жёлтые акценты. Первичные источники — `public/docs/sources.md`.

## Публикация

Пакет зарегистрирован в `course.json`. Корневой `npm run build` собирает его и копирует `dist/` в `lectures/testing-lecture/`. Коммитятся исходники, lockfile и готовая статика. Существующий единственный источник Pages — `main` и `/`; дополнительный deploy-workflow не создаётся.
