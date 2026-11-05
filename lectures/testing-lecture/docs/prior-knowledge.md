# На что опирается лекция о тестировании

Источник — фактические исходники и README пакетов текущего монорепозитория. Это сведения о содержании курса, не оценка знаний каждого студента.

- `packages/react-lecture/`: функции, объекты, DOM, JSX, компоненты, props/callback, useState, подъём состояния, npm и сборка.
- `packages/react-api-lecture/`: массив книг, map/key, fetch/JSON, response.ok, async/await, useEffect, loading/success/error и разделение клиента/UI.
- `packages/react-state-managers/`: маршруты, общий store, RTK Query, PATCH цены, локальное/серверное состояние и кеш.
- `packages/ts-lecture/`: базовые типы, union, типы props/callback/events и Promise. Практика формы уже требовала отклонять пустую/отрицательную цену.

Сквозная предметная область остаётся прежней: книги и цена. В маленьком эталоне не нужен Redux и Router: цель — границы тестов, а не повтор настройки store.

Новые темы вводим с нуля: runner и assertion, test/expect, AAA, RED–GREEN–REFACTOR, test.each, Testing Library, jsdom, user-event, mock callback, Playwright, локаторы/ожидания, перехват HTTP, изоляция и trace.

Не требуем: собственного test runner, сложных TypeScript generic-ов, MSW, Docker, настоящей БД, авторизации, настройки CI-провайдера, порога покрытия или backend-стенда. Полный системный e2e объясняется как отдельная граница, но не выдаётся за выполненную проверку.
