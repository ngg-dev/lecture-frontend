# Первичные источники и принятые границы

Документация проверена при подготовке лекции 06.11.2026. Реальные установленные версии зафиксированы в `package.json` и `package-lock.json` пакета.

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
- [VS Code: тестирование с ИИ](https://code.visualstudio.com/docs/agents/guides/test-code-with-ai) — ожидания из требований, проверка assertions, настоящий запуск и разбор падений.
- [Playwright: test agents](https://playwright.dev/docs/test-agents) — пример применения ИИ для плана, генерации и разбора браузерных тестов; настройка агентов не требуется для практики.

## Реальные случаи

Исторические источники [1]–[3], описание компаний и затронутых процессов, подтверждённые факты и отдельно педагогические выводы: [разбор инцидентов](incidents.md). Knight Capital, GitLab и Cloudflare представлены на отдельных слайдах со ссылкой на первичный источник. Это не утверждение, что у всех компаний отсутствовали тесты; у Cloudflare они были и успешно прошли.

## Термины

В этой лекции unit — чистое правило без React/DOM; компонентный тест с React, DOM и user-event называется компонентным/интеграционным. Это выбранная учебная граница, не универсальное определение размера unit.

Браузерный сценарий через весь доступный фронтенд полезен, но не доказывает работоспособность исключённого backend. С route.fulfill API подменён. Полный системный e2e потребовал бы настоящего тестового сервера и изолированных данных. На Pages backend отсутствует.

## Выбор инструмента и работа с ИИ

Сначала определяем риск, условия и наблюдаемый результат, затем выбираем минимальную достаточную проверку. Jest и Playwright — стек этого учебного проекта; испытания производительности и восстановления требуют своих условий и инструментов.

ИИ можно поручить предложить граничные случаи, черновик теста или объяснение падения. Ожидаемый результат задаёт договорённость о поведении, а не текущая реализация. Человек проверяет assertions, запускает тесты и убеждается, что намеренная регрессия приводит к осмысленному падению.

## Пошаговые примеры и снимки

Слайды `#unit-lab` → `#unit-lab-fixed` и `#component-lab` → `#component-lab-retry` объясняют условия и результаты последовательно; код на слайдах не выполняется. Схемы и таблицы — учебные иллюстрации. Встроенные снимки Jest, Playwright и состояний магазина получены настоящими запусками через `npm run capture:examples`, происхождение записано в `public/examples/manifest.json`. Обновление снимков и границы mock API описаны в README.
