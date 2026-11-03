От JavaScript к компонентам — лекция

GitHub Pages
В репозитории настроен workflow .github/workflows/deploy-pages.yml.
Он устанавливает зависимости через npm ci, запускает npm run build
и публикует содержимое папки publish после каждого push в ветку main.

Первый запуск:
1. Откройте https://github.com/ngg-dev/react-lecture/settings/pages
2. В разделе Build and deployment выберите Source: GitHub Actions.
3. Добавьте изменения конфигурации в коммит и отправьте его в ветку main.
4. Дождитесь успешного завершения Deploy presentation to GitHub Pages
   во вкладке Actions.

После публикации презентация будет доступна по адресу:
https://ngg-dev.github.io/react-lecture/

Если конфигурация уже отправлена до включения Pages, запустите workflow
вручную: Actions → Deploy presentation to GitHub Pages → Run workflow,
выбрав ветку main.

Для публикации через этот workflow загружайте в репозиторий весь проект,
включая скрытую папку .github, папку src, build.mjs, package.json
и package-lock.json. Папка node_modules не нужна.
Дополнительные токены и секреты настраивать не требуется.
Все ресурсы встроены в index.html, поэтому путь /react-lecture/
не требует отдельной настройки. Переходы между слайдами используют #.

Документация GitHub:
https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

Размещение
Загрузите index.html в корень любого статического хостинга.
Библиотеки, стили и примеры уже встроены. Node.js на хостинге не нужен.
Файл также открывается самостоятельно без интернета.
Ссылки на официальную документацию требуют интернета.

Управление
Кнопки Назад и Далее, клавиши стрелок и Page Up / Page Down.
Home — первый слайд, End — последний.
Ссылка с #slide-13 открывает тринадцатый слайд.
Каждый студент работает со своей копией примеров. Синхронизации устройств нет.
При смене слайда учебные эксперименты начинаются заново.

Редактирование
Исходники: ../src/lecture.jsx, ../src/extras.jsx, ../src/ui.jsx,
../src/shop-demo.js и ../src/styles.css
После правок выполните npm run build в корне проекта.
Сборка обновит ../presentation.html и этот index.html.
