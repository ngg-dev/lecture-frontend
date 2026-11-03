# На что опирается лекция «Обозреваем TS»

Анализ выполнен 17 октября 2026 года пятью отдельными субагентами, по одному на каждую папку с лекцией. Это сведения о содержании курса, а не измерение навыков конкретных студентов. Внутренняя реализация презентаций не считается пройденным учебным материалом.

| Папка | Объём | Материал, на который можно опереться | Граница |
| --- | --- | --- | --- |
| `React/` | 43 слайда, 79 минут | DOM, функции и объекты, компоненты, JSX, props, callback, useState, подъём состояния, Node/npm, JSX → JS, сборщик | Списки и API только анонсированы. TS не преподавался. |
| `React-API/` | 34 слайда, 70 минут + 20 практики | Массив книг, map/key, fetch и JSON, response.ok, async/await, useEffect/useBooks, idle/loading/success/error, разделение клиента и UI | Гонки и отмена запросов вне обязательной практики. TS отсутствует. |
| `State-Managers/` | 59 слайдов, 104 + 15 минут | Router, общий store, Redux Toolkit, RTK Query, локальное и серверное состояние, кеш, PATCH цены, преобразование input в число | Zustand/TanStack Query — дополнение. Основные примеры на JS, TS отсутствует. |
| `React — копия/` | 43 слайда, 79 минут | Повтор первой лекции: проверенные JS/JSX-исходники, CSS и план совпадают с React | Не считать новым этапом курса; не синхронизировать автоматически. |
| `meetup-prof/` | 7 слайдов, 5–6 минут | Назначение HTML/CSS/JS, компонентов, типов, сборщиков и других инструментов | Профориентационное знакомство, без учебного кода. Упоминание TS не даёт знания синтаксиса. |

## Выбор содержания

Сквозная область — книжный магазин. В React-API и State-Managers есть книги «Мастер и Маргарита», «Пикник на обочине», «Солярис», карточка, корзина и цена. Модель React-API: id/title/author/price; State-Managers дополнительно использует color для оформления.

Редакция от 24 октября 2026 года сохраняет предметную область и вводит TS с нуля: задачи магазина, базовые типы, type/interface и расширение, простые union, Pick/Omit/Record. Далее основная практика — React: props, callbacks, useState, события и формы, готовые типы React/DOM, useRef, useEffect и возвращаемый тип своего хука.

Дженерики читаются через готовые API useState<Book[]> и Promise<Book[]>; собственные generic-функции, keyof/T[K], never и подробные guards вынесены в docs/extra-topics.md. Практическое демо меняет цену книги и добавляет её в типизированную корзину. Это продолжение уже разобранных задач без повторного изучения Router или Redux.

## Исходники анализа

- `React/src/lecture.jsx`, `React/src/ui.jsx`, `React/src/extras.jsx`, `React/speaker-guide.txt`.
- `React-API/content.js`, `React-API/src/App.jsx`, `React-API/src/slide-renderer.js`, `React-API/scripts/check.mjs`.
- `State-Managers/src/content.js`, `State-Managers/src/main.jsx`, `State-Managers/src/model.js`, `State-Managers/Лабораторная работа 6.md`.
- `React — копия/src/lecture.jsx`, остальные исходники и `speaker-guide.txt`: сопоставлены с React без изменений.
- `meetup-prof/browser-deck/dist/slides.js`, `meetup-prof/lecture/talk-script-5-6-min.txt`.

Для новой оболочки адаптированы навигация, компоненты кода и визуальная система State-Managers. Существующие лекции не редактировались.
