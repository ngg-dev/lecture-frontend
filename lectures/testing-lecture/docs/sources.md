# Первичные источники и принятые границы

Документация проверена при подготовке лекции 05.11.2026. Реальные установленные версии зафиксированы в `package.json` и `package-lock.json` пакета.

- [Jest: запуск, Babel и TypeScript](https://jestjs.io/docs/getting-started) — test/expect, babel-jest, отдельная проверка типов.
- [Jest: конфигурация](https://jestjs.io/docs/configuration) — testMatch, transform, testEnvironment и setupFilesAfterEnv.
- [Jest: assertions](https://jestjs.io/docs/expect) — toBe, toEqual, toBeNull.
- [Jest: mock functions](https://jestjs.io/docs/mock-function-api) — jest.fn, mockResolvedValue и mockRejectedValueOnce.
- [Testing Library: React](https://testing-library.com/docs/react-testing-library/intro/) — DOM вместо внутренних экземпляров компонентов.
- [Testing Library: запросы](https://testing-library.com/docs/queries/about/) — getBy/queryBy/findBy.
- [user-event](https://testing-library.com/docs/user-event/intro/) — setup и пользовательские взаимодействия.
- [jest-dom](https://github.com/testing-library/jest-dom) — DOM matcher-ы для Jest.
- [Playwright: лучшие практики](https://playwright.dev/docs/best-practices) — поведение пользователя, изоляция, роли и web-first assertions.
- [Playwright: auto-wait](https://playwright.dev/docs/actionability) — проверки перед действием и повтор assertions.
- [Playwright: mock API](https://playwright.dev/docs/mock) — route/fulfill до навигации.
- [Playwright: trace](https://playwright.dev/docs/trace-viewer) — просмотр шагов, DOM и запросов.

## Термины

В этой лекции unit — чистое правило без React/DOM; компонентный тест с React, DOM и user-event называется компонентным/интеграционным. Это выбранная учебная граница, не универсальное определение размера unit.

Браузерный сценарий через весь доступный фронтенд полезен, но не доказывает работоспособность исключённого backend. С route.fulfill API подменён. Полный системный e2e потребовал бы настоящего тестового сервера и изолированных данных. На Pages backend отсутствует.

## Что не является отчётом runner-а

Мини-лаборатория на слайде вызывает реальные функции в браузере и показывает собственные сравнения. Она явно не названа Jest. Фрагменты Expected/Received на слайдах объясняют смысл диагностики, а реальные результаты получают только запуском команд.
