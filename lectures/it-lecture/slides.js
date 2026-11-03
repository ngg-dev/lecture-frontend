window.DECK = [
  {
    "id": "intro",
    "title": "Что делает фронтенд-разработчик",
    "label": "Знакомство",
    "name": "Егор Антонов",
    "role": "Senior фронтенд-разработчик",
    "notes": "Представиться и рассказать, чем занимается фронтенд, какие технологии использует, зачем он нужен бизнесу и какие есть направления развития.",
    "sources": []
  },
  {
    "id": "work",
    "title": "Чем занимается\nфронтенд-разработчик",
    "label": "Профессия",
    "lead": "Создаёт интерфейсы\nдля людей",
    "description": "Разрабатывает современные веб-приложения. Почти всё, что вы видите и нажимаете в браузере, связано с работой фронтенда.",
    "notes": "Фронтенд создаёт интерфейсы для людей: обеспечивает интерактивность, связывает дизайн с логикой приложения и заботится об удобстве и доступности для пользователя.",
    "sources": [
      {
        "label": "MDN: веб-разработка",
        "url": "https://developer.mozilla.org/en-US/curriculum/"
      },
      {
        "label": "React Native",
        "url": "https://reactnative.dev/"
      },
      {
        "label": "Node.js",
        "url": "https://nodejs.org/learn/getting-started/introduction-to-nodejs"
      }
    ],
    "principles": [
      {
        "title": "Обеспечивает интерактивность",
        "detail": "Оживляет кнопки, формы и действия в приложении."
      },
      {
        "title": "Связывает дизайн и логику",
        "detail": "Превращает макет в работающий интерфейс."
      },
      {
        "title": "Заботится о пользователе",
        "detail": "Делает интерфейс понятным, удобным и доступным."
      }
    ]
  },
  {
    "id": "projects",
    "title": "Что создают на JavaScript",
    "label": "Реальные проекты",
    "projects": [
      {
        "id": "vscode",
        "category": "Приложение",
        "title": "Visual Studio Code",
        "description": "Редактор для написания кода и работы над проектами",
        "image": "assets/projects/vscode.png",
        "imageAlt": "Интерфейс Visual Studio Code"
      },
      {
        "id": "dino",
        "category": "Браузерная игра",
        "title": "Chrome Dino",
        "description": "Игра про динозаврика, который перепрыгивает препятствия",
        "image": "assets/projects/dino.png",
        "imageAlt": "Интерфейс Chrome Dino"
      },
      {
        "id": "obsidian",
        "category": "Заметки и знания",
        "title": "Obsidian",
        "description": "Заметки, связанные идеи и личная база знаний",
        "image": "assets/projects/obsidian.png",
        "imageAlt": "Официальное изображение Obsidian"
      },
      {
        "id": "slack",
        "category": "Работа в команде",
        "title": "Slack",
        "description": "Чаты, каналы и совместная работа команды",
        "image": "assets/projects/slack.jpg",
        "imageAlt": "Каналы Slack — изображение с официального сайта"
      },
      {
        "id": "figma",
        "category": "Дизайн",
        "title": "Figma",
        "description": "Создание интерфейсов и интерактивных прототипов",
        "image": "assets/projects/figma.png",
        "imageAlt": "Интерфейс Figma UI3 — изображение из официального блога"
      }
    ],
    "notes": "Пять реальных проектов. Visual Studio Code использует TypeScript и Electron. Chrome Dino — встроенная в Chrome игра, работающая без интернета; текущие исходники Chromium написаны на TypeScript и используют Canvas. Obsidian — приложение для локальных заметок на Electron; базовая работа не требует аккаунта или интернета. Slack использует TypeScript и Electron в десктопном клиенте. Для Figma React и TypeScript относятся к веб-интерфейсу: графический движок также использует C++ и WebAssembly. Превью взяты из публичных материалов проектов; источники изображений сохранены в assets/projects/sources.json. Проверено 10 октября 2026 года.",
    "sources": [
      {
        "label": "VS Code: TypeScript",
        "url": "https://code.visualstudio.com/blogs/2026/06/26/iterating-faster-with-ts-7"
      },
      {
        "label": "VS Code: Electron",
        "url": "https://code.visualstudio.com/blogs/2022/11/28/vscode-sandbox"
      },
      {
        "label": "Google: Chrome Dino",
        "url": "https://blog.google/products-and-platforms/products/chrome/chrome-dino/"
      },
      {
        "label": "Chromium: исходники Chrome Dino на TypeScript",
        "url": "https://github.com/chromium/chromium/tree/main/components/neterror/resources/dino_game"
      },
      {
        "label": "Electron: Obsidian в каталоге приложений",
        "url": "https://www.electronjs.org/apps"
      },
      {
        "label": "Obsidian: локальные данные и бесплатное использование",
        "url": "https://obsidian.md/license"
      },
      {
        "label": "Slack: TypeScript",
        "url": "https://slack.engineering/typescript-at-slack/"
      },
      {
        "label": "Figma: веб-интерфейс и графический движок",
        "url": "https://www.figma.com/blog/how-figma-draws-inspiration-from-the-gaming-world/"
      }
    ]
  },
  {
    "id": "demand",
    "title": "Востребованность\nфронтенда",
    "label": "Рынок",
    "lead": "Бизнес развивается.\nИнтерфейсы — вместе с ним.",
    "description": "Новые продукты требуют новых экранов. Существующим сервисам нужны улучшения и поддержка.",
    "fields": [
      {
        "name": "Банки и финтех",
        "use": "Платежи, переводы, инвестиции"
      },
      {
        "name": "E-commerce",
        "use": "Каталог, корзина, оформление заказа"
      },
      {
        "name": "EdTech",
        "use": "Курсы, тренажёры, проверка знаний"
      },
      {
        "name": "MedTech",
        "use": "Запись к врачу, кабинет пациента"
      },
      {
        "name": "Игровая индустрия",
        "use": "Браузерные игры, игровые интерфейсы"
      },
      {
        "name": "Медиа и соцсети",
        "use": "Ленты, стриминг, общение"
      },
      {
        "name": "TravelTech",
        "use": "Билеты, бронирования, маршруты"
      },
      {
        "name": "Логистика и доставка",
        "use": "Заказы, трекинг, карты"
      },
      {
        "name": "B2B и SaaS",
        "use": "CRM, ERP, рабочие кабинеты"
      },
      {
        "name": "GovTech",
        "use": "Заявления, справки, госуслуги"
      },
      {
        "name": "PropTech",
        "use": "Поиск жилья, аренда, сделки"
      },
      {
        "name": "Промышленность и IoT",
        "use": "Мониторинг, данные устройств"
      }
    ],
    "skills": [
      "Практические навыки",
      "Понимание задач бизнеса",
      "Умение рассуждать",
      "Желание делать, желание создавать"
    ],
    "notes": "Компании создают цифровые продукты и развивают существующие. Это порождает задачи для интерфейса. На слайде представлены типичные сферы и примеры применения, а не исчерпывающая классификация отраслей и не прогноз числа вакансий. Помимо практических навыков, важны понимание задачи, способность рассуждать и желание создавать.",
    "sources": [
      {
        "label": "MDN: веб-разработка",
        "url": "https://developer.mozilla.org/en-US/curriculum/"
      }
    ]
  },
  {
    "id": "stack",
    "title": "Современный стек\nфронтенд-разработчика",
    "label": "Технологии",
    "foundation": "HTML + CSS",
    "foundationDetail": "Основа: структура и оформление веб-страниц",
    "technologies": [
      {
        "label": "Язык",
        "title": "JavaScript",
        "detail": "Логика и поведение приложения",
        "icon": "javascript",
        "color": "cream"
      },
      {
        "label": "Типизация",
        "title": "TypeScript",
        "detail": "Типы, контракты и надёжность",
        "icon": "typescript",
        "color": "blue"
      },
      {
        "label": "Интерфейс",
        "title": "React",
        "detail": "Компоненты, состояние и хуки",
        "icon": "react",
        "color": "white"
      },
      {
        "label": "Данные и состояние",
        "title": "Redux Toolkit",
        "detail": "RTK Query / TanStack Query",
        "icon": "redux",
        "color": "lilac"
      },
      {
        "label": "Стили",
        "title": "SCSS / CSS Modules",
        "detail": "Tailwind и адаптивная вёрстка",
        "icon": "sass",
        "color": "rose"
      },
      {
        "label": "Сборка",
        "title": "Vite / Webpack / Rspack",
        "detail": "npm / pnpm для зависимостей",
        "icon": "vitejs",
        "color": "blush"
      },
      {
        "label": "Тестирование",
        "title": "Vitest / Playwright",
        "detail": "Модульные и E2E-тесты",
        "icon": "playwright",
        "color": "mint"
      },
      {
        "label": "Командная работа",
        "title": "Git",
        "detail": "Коммиты, ветки и code review",
        "icon": "git",
        "color": "white"
      },
      {
        "label": "Основы серверной среды",
        "title": "Node.js",
        "detail": "Скрипты, инструменты и простое API",
        "icon": "nodejs",
        "color": "mint"
      }
    ],
    "notes": "HTML и CSS — основа фронтенда. JavaScript и TypeScript показаны отдельно. SCSS — синтаксис Sass. Git нужен для истории изменений и командной работы. Базовое понимание Node.js полезно для инструментов, скриптов и знакомства с серверной разработкой. Остальные инструменты команда выбирает под задачи проекта.",
    "sources": [
      {
        "label": "React",
        "url": "https://react.dev/"
      },
      {
        "label": "Redux Toolkit",
        "url": "https://redux.js.org/toolkit/introduction/getting-started"
      },
      {
        "label": "TypeScript",
        "url": "https://www.typescriptlang.org/"
      },
      {
        "label": "Vite",
        "url": "https://vite.dev/"
      },
      {
        "label": "Webpack",
        "url": "https://webpack.js.org/"
      },
      {
        "label": "Rspack",
        "url": "https://rspack.dev/"
      },
      {
        "label": "Логотипы: Devicon",
        "url": "https://github.com/devicons/devicon"
      },
      {
        "label": "Sass / SCSS",
        "url": "https://sass-lang.com/documentation/syntax/"
      },
      {
        "label": "Git",
        "url": "https://git-scm.com/doc"
      },
      {
        "label": "Node.js",
        "url": "https://nodejs.org/learn/getting-started/introduction-to-nodejs"
      }
    ]
  },
  {
    "id": "growth",
    "title": "Что ещё может делать фронтендер",
    "label": "Больше возможностей",
    "notes": "Навыки фронтенда можно применять и за пределами обычных сайтов: создавать серверную часть, игры, 3D-сцены, карты, мобильные и десктопные приложения. Full stack — это серверная разработка, например Node.js, API, база данных и авторизация. Pixi.js предоставляет 2D-рендеринг, Phaser — игровой фреймворк. Three.js применяют для 3D-графики, в том числе в браузерных играх. MapLibre GL JS помогает создавать интерактивные карты. React Native позволяет создавать мобильные приложения для iOS и Android. Tauri и Electron позволяют использовать веб-интерфейс в десктопных приложениях. У каждого направления есть дополнительные требования: например, нативная часть Tauri использует Rust. Это дополнительные возможности: осваивать все эти инструменты каждому фронтендеру не требуется.",
    "sources": [
      {
        "label": "Node.js",
        "url": "https://nodejs.org/learn/getting-started/introduction-to-nodejs"
      },
      {
        "label": "Three.js",
        "url": "https://threejs.org/"
      },
      {
        "label": "PixiJS",
        "url": "https://pixijs.com/"
      },
      {
        "label": "Phaser",
        "url": "https://phaser.io/"
      },
      {
        "label": "MapLibre GL JS",
        "url": "https://maplibre.org/maplibre-gl-js/docs/"
      },
      {
        "label": "React Native",
        "url": "https://reactnative.dev/"
      },
      {
        "label": "Tauri",
        "url": "https://v2.tauri.app/"
      },
      {
        "label": "Electron",
        "url": "https://www.electronjs.org/"
      }
    ],
    "directions": [
      {
        "title": "Бэкенд",
        "tools": "Node.js",
        "detail": "API, базы данных и авторизация для сервисов",
        "symbol": "{ }"
      },
      {
        "title": "Игры",
        "tools": "Pixi.js / Phaser",
        "detail": "2D-игры и игровые интерфейсы. Для 3D — Three.js",
        "symbol": "game"
      },
      {
        "title": "3D-графика и карты",
        "tools": "Three.js / MapLibre",
        "detail": "3D-сцены, визуализация данных и интерактивные карты",
        "symbol": "cube"
      },
      {
        "title": "Мобильные приложения",
        "tools": "React Native",
        "detail": "Приложения для iOS и Android на знакомом React",
        "symbol": "phone"
      },
      {
        "title": "Десктопные приложения",
        "tools": "Tauri / Electron",
        "detail": "Приложения для Windows, macOS и Linux с веб-интерфейсом",
        "symbol": "desktop"
      }
    ]
  },
  {
    "id": "hackathon",
    "title": "Альфа-Будущее\nХакатон 2026",
    "label": "Попробовать на практике",
    "online": "19–26 октября",
    "final": "28–29 ноября",
    "prize": "500 000 ₽",
    "benefit": "Fast Track на стажировку",
    "deadline": "Регистрация до 18 октября",
    "registration": "https://it.fut.ru/event/alfabank/hack",
    "notes": "Информация проверена 10 октября 2026 года по лендингу мероприятия. Онлайн-этап: 19–26 октября; финал в Москве: 28–29 ноября. Три трека: новостная аналитика для принятия бизнес-решений, умный кредитный кабинет предпринимателя, ИИ-агент для разработки ML-моделей. В каждом треке три призовых места: 500 000, 300 000 и 200 000 рублей команде. Первое место также даёт Fast Track на стажировку — ускоренное прохождение отбора. Команды состоят из 3–5 человек; организаторы помогают найти команду. Регистрация до 18 октября включительно. Баннер взят с реального лендинга хакатона. Роли в команде взяты из подробных карточек треков на it.fut.ru 10 октября 2026 года. Цвета карточек и тегов приведены к общей палитре презентации: тёмные фоны, светлый текст и красные акценты. Названия, технические описания задач и роли трёх треков дословно перенесены из модальных карточек официального лендинга cdn-it.fut.ru/event/alfabank/hack, проверено 10 октября 2026 года; регистр и написание сохранены. Тексты сверены с лендингом официального партнёра FutureToday; основной лендинг alfabank.ru был недоступен. Порядок «новости → кредит → ИИ» принят по двум независимым анонсам, а не непосредственно проверен на alfabank.ru.",
    "sources": [
      {
        "label": "Лендинг хакатона",
        "url": "https://it.fut.ru/event/alfabank/hack"
      },
      {
        "label": "Анонс и условия",
        "url": "https://changellenge.com/event/alfa-budushchee-khakaton-2026-alfa-bank/"
      },
      {
        "label": "Альфа-Будущее",
        "url": "https://t.me/alfafuture/2980"
      },
      {
        "label": "Подробные карточки треков официального лендинга",
        "url": "https://cdn-it.fut.ru/event/alfabank/hack"
      }
    ],
    "tracks": [
      {
        "description": "Создайте интеллектуальный сервис для руководителей крупного бизнеса, который учитывает контекст конкретной компании и превращает поток новостей и аналитики Альфа‑Банка в персонализированные бизнес‑инсайты о значимых событиях, рисках и возможностях",
        "direction": "Направление: Корпоративно‑инвестиционный бизнес (КИБ)",
        "roles": [
          "ML / LLM / Prompt Engineer",
          "ML / LLM Engineer",
          "Product / UX / Business analyst",
          "Backend Developer",
          "Frontend Developer"
        ],
        "title": "Превратить поток новостей в бизнес-решения"
      },
      {
        "description": "Разработайте личный кабинет для сегмента малого и микробизнеса с ИИ‑ассистентом, который понимает потребности клиента, помогает выбрать подходящий кредитный продукт и пройти весь путь от заявки до решения",
        "direction": "Направление: Малый и микробизнес (ММБ)",
        "roles": [
          "Frontend Developer",
          "Backend Developer",
          "Data Scientist / ML Engineer",
          "Product / UX / Business Analyst"
        ],
        "title": "Персонализировать подбор кредита"
      },
      {
        "description": "Разработайте ИИ-агента, который самостоятельно строит ML-решения под разные задачи и улучшает их на основе результатов экспериментов",
        "direction": "Направление: Искусственный интеллект и данные",
        "roles": [
          "AI/Agent Engineer",
          "Data Scientist/ML Engineer",
          "Data Engineer",
          "MLOps Engineer"
        ],
        "title": "Научить ИИ-агента создавать ML-модели"
      }
    ]
  }
];
