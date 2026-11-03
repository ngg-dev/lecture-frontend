# it-lecture

Браузерная презентация «Что делает фронтенд-разработчик».
Автор: Егор Антонов, Senior фронтенд-разработчик.
Семь слайдов, плавные переходы и готовый сценарий на 5–6 минут.

**Презентация:** https://ngg-dev.github.io/it-lecture/

## Материалы

- `browser-deck/dist/` — исходники презентации: HTML, CSS, JavaScript и изображения.
- `browser-deck/dist/slides.js` — содержание слайдов и источники.
- `browser-deck/dist/assets/projects/sources.json` — источники изображений проектов.
- `lecture/frontend-talk.pdf` — актуальная PDF-версия: семь слайдов в формате 16:9, без элементов управления, с поиском по тексту.
- `lecture/talk-script-5-6-min.txt` — текст к каждому слайду и поминутный план выступления 11 октября 2026 года.
- `browser-deck/export-standalone.mjs` — сборка одного HTML-файла для показа без интернета.
- `.github/workflows/pages.yml` — автоматическая публикация на GitHub Pages.

## Локальный запуск

Нужен Node.js 22 или новее. Устанавливать зависимости не требуется.

```sh
npm start
```

Откройте http://127.0.0.1:4173/. Можно также открыть `browser-deck/dist/index.html` прямо в браузере.

Стрелки, пробел и Page Up / Page Down переключают слайды; `F` включает полный экран. Прямая ссылка на слайд: `https://ngg-dev.github.io/it-lecture/#3`.

## Проверка и автономная копия

```sh
npm run check
npm run export
```

Автономная презентация появится в `output/frontend-talk.html`. Все изображения встроены в файл, интернет для показа не нужен.

## Публикация

GitHub Actions проверяет JavaScript и публикует `browser-deck/dist/` после каждого push в `main`. Workflow также можно запустить вручную во вкладке Actions. В Settings → Pages источником публикации должен быть **GitHub Actions**.

После правок:

```sh
git add browser-deck lecture
git commit -m "Update lecture"
git push
```

Сценарий хранится в репозитории отдельно от каталога сайта. Даты хакатона и ссылки на источники находятся в `browser-deck/dist/slides.js`; перед новым выступлением их следует актуализировать.
