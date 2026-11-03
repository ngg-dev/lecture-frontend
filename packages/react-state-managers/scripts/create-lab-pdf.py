#!/usr/bin/env python3
"""Create the separate, printable assignment for laboratory 6.

Requires reportlab. Font lookup supports macOS and common Linux installations;
set LAB_FONT_DIR to a directory containing DejaVuSans*.ttf to override it.
"""

from pathlib import Path
import os

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, Table, TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output/pdf/Лабораторная работа 6.pdf"
INK = colors.HexColor("#20221f")
BLUE = colors.HexColor("#2348ff")
MUTED = colors.HexColor("#62685f")
PAPER = colors.HexColor("#f5f4ef")
LINE = colors.HexColor("#dcded7")


def register_fonts():
    candidates = []
    if os.environ.get("LAB_FONT_DIR"):
        candidates.append(Path(os.environ["LAB_FONT_DIR"]))
    candidates.extend([
        Path("/usr/share/fonts/truetype/dejavu"),
        Path.home() / ".cache/codex-runtimes/codex-primary-runtime/dependencies/native/libreoffice-headless/libreoffice/LibreOfficeDev.app/Contents/Resources/fonts/truetype",
    ])
    for directory in candidates:
        regular = directory / "DejaVuSans.ttf"
        bold = directory / "DejaVuSans-Bold.ttf"
        mono = directory / "DejaVuSansMono.ttf"
        if all(path.exists() for path in (regular, bold, mono)):
            break
    else:
        directory = Path("/System/Library/Fonts/Supplemental")
        regular = directory / "Arial.ttf"
        bold = directory / "Arial Bold.ttf"
        mono = directory / "Courier New.ttf"
    for name, path in (("Lab", regular), ("Lab-Bold", bold), ("LabMono", mono)):
        pdfmetrics.registerFont(TTFont(name, str(path)))
    pdfmetrics.registerFontFamily("Lab", normal="Lab", bold="Lab-Bold")


register_fonts()
STYLES = {
    "eyebrow": ParagraphStyle("eyebrow", fontName="Lab-Bold", fontSize=9,
                               leading=12, textColor=BLUE, spaceAfter=10),
    "title": ParagraphStyle("title", fontName="Lab-Bold", fontSize=25,
                             leading=29, textColor=INK, spaceAfter=12),
    "subtitle": ParagraphStyle("subtitle", fontName="Lab-Bold", fontSize=14,
                                leading=18, textColor=INK, spaceAfter=12),
    "body": ParagraphStyle("body", fontName="Lab", fontSize=10.5,
                            leading=14.2, textColor=INK, spaceAfter=8),
    "small": ParagraphStyle("small", fontName="Lab", fontSize=9.3,
                             leading=12.8, textColor=MUTED, spaceAfter=7),
    "section": ParagraphStyle("section", fontName="Lab-Bold", fontSize=14,
                               leading=18, textColor=INK, spaceBefore=13,
                               spaceAfter=9),
    "code": ParagraphStyle("code", fontName="LabMono", fontSize=9,
                            leading=13, textColor=INK, spaceAfter=3),
}


def para(text, style="body"):
    return Paragraph(text, STYLES[style])


def criterion(title, text):
    return para(f"<b>{title}.</b> {text}")


def note(title, text):
    table = Table([[para(title, "eyebrow"), para(text, "small")]],
                  colWidths=[76, 423])
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PAPER),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 10),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    return table


def footer(canvas, doc):
    canvas.saveState()
    width, height = A4
    canvas.setStrokeColor(LINE)
    canvas.line(48, 42, width - 48, 42)
    canvas.setFont("Lab", 8)
    canvas.setFillColor(MUTED)
    canvas.drawString(48, 28, "Лабораторная работа 6  /  React")
    canvas.drawRightString(width - 48, 28, f"{doc.page} / 3")
    if doc.page > 1:
        canvas.setFont("Lab-Bold", 8)
        canvas.setFillColor(BLUE)
        canvas.drawString(48, height - 32, "РОУТИНГ · ОБЩЕЕ СОСТОЯНИЕ · КЕШ ЗАПРОСОВ")
    canvas.restoreState()


story = [
    para("ПРАКТИКА ПОСЛЕ REACT-API", "eyebrow"),
    para("Лабораторная работа 6", "title"),
    para("Роутинг, общее состояние<br/>и кеш запросов в React", "subtitle"),
    para("Продолжите <b>свой проект из лабораторной №5</b>. Добавьте страницы, общий клиентский выбор и кеш серверных данных. Используйте сущности своей темы: товары, фильмы, задачи и т. п."),
    para("<b>Стек:</b> React Router, Redux Toolkit, React Redux и RTK Query. Вариант на Zustand + TanStack Query реализовывать не требуется."),
    para("npm install react-router @reduxjs/toolkit react-redux", "code"),
    Spacer(1, 8),
    note("КРИТЕРИИ", "Накопительные: оценка 4 включает все условия на 3, оценка 5 включает все условия на 4. Срок сдачи назначает преподаватель."),
    para("3 / Удовлетворительно", "section"),
    criterion("Маршруты", "Работают три страницы: список объектов, детали по динамическому <b>id</b> и отдельная страница выбранных объектов. Переходы через <b>Link</b> или <b>NavLink</b> не перезагружают документ."),
    criterion("Общее состояние", "Redux store создан один раз вне переключаемых страниц и подключён через <b>Provider</b>. <b>createSlice</b> хранит корзину, избранное или другой клиентский выбор. Есть добавление через <b>useDispatch</b>; минимум два компонента читают общее состояние через <b>useSelector</b>."),
    criterion("Переходы", "Выбор сохраняется при смене страницы. Сохранение после полной перезагрузки браузера не требуется."),
    criterion("API и кеш", "Минимум один список загружается <b>реальным HTTP-запросом</b> через RTK Query. Подключены <b>createApi</b>, его reducer и middleware. Компонент использует сгенерированный query-хук."),
    criterion("Отображение", "Показаны первая загрузка, сообщение об ошибке и успешный список со стабильным <b>key</b>."),
    Spacer(1, 4),
    note("НА ЗАЩИТЕ", "Добавьте объект, покажите общий счётчик, смените страницу и загрузите данные API. Объясните, где хранится клиентский выбор и где хранится ответ сервера."),
    PageBreak(),
    para("4 / Хорошо", "title"),
    para("Выполнены все условия на 3, а также:", "small"),
    criterion("Навигация", "Общая шапка и страницы организованы через layout и <b>Outlet</b>. Неизвестный путь и неизвестный <b>id</b> показывают понятное сообщение. Работают «Назад» и «Вперёд» браузера."),
    criterion("Прямая ссылка", "Детали открываются по скопированному адресу и после обновления страницы. Для GitHub Pages подходит <b>HashRouter</b>; для <b>BrowserRouter</b> хостингу нужен fallback на <b>index.html</b>. Проверьте базовый путь ресурсов в подпапке."),
    criterion("Управление выбором", "Можно убрать объект или изменить количество. Все потребители сразу видят результат. Счётчики и суммы вычисляются из исходных данных без независимых копий одного значения в нескольких <b>useState</b>."),
    criterion("Состояния запроса", "После ошибки доступен повтор без перезагрузки. Для успешного пустого ответа есть отдельное сообщение. Первая загрузка и фоновое обновление различаются через <b>isLoading</b> / <b>isFetching</b>; при обновлении прежние данные остаются видны."),
    criterion("Проверка кеша", "Покажите два компонента с одинаковым endpoint и аргументом либо возврат к использованному списку. Во вкладке <b>Network</b> объясните, когда используется кеш и когда отправляется запрос. Ответ API не копируется вручную в отдельный slice."),
    note("НА ЗАЩИТЕ", "Покажите ошибку, повтор и результат; пустой список и повторное использование кеша. Объясните, почему другой id может означать другую запись кеша."),
    para("Готовый HTTP API", "section"),
    para("Если ваше API не сохраняет изменения, используйте <b>выдаваемую отдельно папку lab-api</b>: <b>server.mjs</b>, <b>books.json</b> и <b>README.md</b>. Сервер уже написан; разрабатывать backend не нужно. Нужен Node.js 22 или новее."),
    para("Скопируйте папку целиком в корень своего проекта. В первом терминале запустите сервер, во втором запустите React-приложение:"),
    para("node lab-api/server.mjs", "code"),
    para("В <b>fetchBaseQuery</b> задайте адрес:", "small"),
    para("baseUrl: 'http://127.0.0.1:4191/api/'", "code"),
    para("Сервер хранит изменения до перезапуска. В <b>lab-api/README.md</b> описаны запросы, ошибка, пустой ответ и сброс. Для своей темы можно изменить <b>books.json</b>, сохранив поля <b>id</b> и <b>price</b>. Сервер запускается локально; GitHub Pages его не выполняет.", "small"),
    PageBreak(),
    para("5 / Отлично", "title"),
    para("Выполнены все условия на 4, а также:", "small"),
    criterion("Изменение данных", "Форма или действие отправляет RTK Query mutation: например, меняет цену, название или статус. HTTP-метод соответствует API: <b>POST</b>, <b>PUT</b> или <b>PATCH</b>."),
    criterion("Валидация", "Некорректное значение не отправляется. Например, цена должна быть конечным числом не меньше нуля; пустое поле не превращается незаметно в ноль."),
    criterion("Результат сохранения", "Виден статус ожидания, повторная отправка временно недоступна. Ошибка показана пользователю; после неё можно повторить попытку. Успех проверяется по ответу запроса. Для <b>try/catch</b> с mutation trigger используйте <b>.unwrap()</b>."),
    criterion("Обновление кеша", "Query endpoints используют <b>providesTags</b>, успешная mutation использует <b>invalidatesTags</b>. Новые данные появляются без перезагрузки. Проверьте список и детали, если у них отдельные endpoints."),
    criterion("Разделение данных", "Черновик формы остаётся локальным, клиентский выбор хранится в своём slice, ответы сервера хранятся в RTK Query. Другие экраны не показывают вручную сохранённую старую копию."),
    note("НА ЗАЩИТЕ", "Покажите изменение → mutation → успешный ответ → обновление затронутых query → новый результат. Воспроизведите ошибку сохранения и повтор. Объясните invalidation для активной и неиспользуемой записи кеша. Общего тега достаточно; точечные теги и оптимистические обновления не обязательны."),
    Spacer(1, 9),
    para("<b>API должно сохранять запись:</b> последующий GET возвращает изменённое значение. Подходит готовый lab-api со стр. 2. Локальный массив с Promise вместо HTTP не заменяет API. База данных, авторизация и отдельная серверная платформа не требуются.", "small"),
    para("Что сдать", "section"),
    criterion("1. Репозиторий", "Ссылка на исходники с инструкцией запуска в <b>README</b>."),
    criterion("2. Приложение", "Работающий локальный вариант или хостинг, если публикация предусмотрена преподавателем."),
    criterion("3. Краткое описание", "Новые страницы, общее состояние, endpoints и выполненный уровень 3 / 4 / 5."),
    criterion("4. Сценарий проверки", "Как воспроизвести загрузку, ошибку и пустой ответ; для оценки 5 также изменение данных. Подойдут настройки учебного сервера, DevTools или подготовленные данные."),
    para("На защите объясните путь данных своими словами. Не размещайте секретные ключи в клиентском коде.", "small"),
]

OUTPUT.parent.mkdir(parents=True, exist_ok=True)
document = SimpleDocTemplate(
    str(OUTPUT), pagesize=A4,
    rightMargin=48, leftMargin=48, topMargin=52, bottomMargin=56,
    title="Лабораторная работа 6: роутинг, состояние и кеш в React",
    author="Материалы курса фронтенд-разработки",
)
document.build(story, onFirstPage=footer, onLaterPages=footer)
print(OUTPUT)
