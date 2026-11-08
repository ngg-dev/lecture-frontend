#!/usr/bin/env python3
"""Build the one-page lab in the measured typography of the earlier assignments.

Run: /usr/bin/python3 scripts/build-lab8-pdf.py
Needs reportlab and the Liberation Serif font (or LAB_SERIF_FONT).
The sample DOCX uses A4, 1440-twip margins, Times New Roman 16 pt, line=276.
"""
import os
from pathlib import Path
from xml.sax.saxutils import escape

from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import Flowable, SimpleDocTemplate, Paragraph, Spacer, KeepTogether

PACKAGE = Path(__file__).resolve().parents[1]
OUTPUT = PACKAGE / 'Лабораторная работа 8.pdf'
FONT = os.environ.get('LAB_SERIF_FONT', '/usr/share/fonts/truetype/liberation/LiberationSerif-Regular.ttf')
pdfmetrics.registerFont(TTFont('LabSerif', FONT))
body = ParagraphStyle('body', fontName='LabSerif', fontSize=16, leading=16.8, spaceAfter=0)
center = ParagraphStyle('center', parent=body, alignment=TA_CENTER)
bullet = ParagraphStyle('bullet', parent=body, leftIndent=14, bulletIndent=2)
flow = []

def p(text, style=body):
    return Paragraph(escape(text), style)

def section(title, items):
    flow.append(Spacer(1, 4))
    block: list[Flowable] = [p(title)]
    block.extend(Paragraph(escape(text), bullet, bulletText='•') for text in items)
    flow.append(KeepTogether(block))

flow.extend([
    p('Лабораторная работа 8', center),
    Spacer(1, 18.4),
    p('Unit и e2e-тестирование'),
    p('Срок: 2 недели от лекции 07.11 (до 21.11.2026)'),
    Spacer(1, 4),
    p('Вводные:'),
    p('Продолжите свой TypeScript-проект из работы №7: добавьте тесты, не переписывая приложение с нуля.'),
    Spacer(1, 4),
    p('Критерии оценок:'),
])
section('Удовлетворительно:', [
    'Jest: проверьте функцию на 6 случаях — обычный, на границе и 4 с неверными данными',
    'подготовьте данные, вызовите настоящую функцию и сравните ответ с правильным (AAA)',
    'добавьте ошибку: тест должен её найти; исправьте код и сохраните оба запуска',
    'npm test, npm run typecheck и npm run build проходят',
])
section('Хорошо:', [
    'выполните всё на «Удовлетворительно»',
    'вторая функция: 3 случая — обычные, пустые данные и значение на границе',
    'загрузка или сохранение: успех и ошибка; ждите ответ, подменяйте только запрос; тесты независимы',
])
section('Отлично:', [
    'выполните всё на «Хорошо»',
    'два теста Playwright: действие на сайте и ошибка с повтором; запуск — npm run test:e2e',
    'у каждого теста свои данные; подмену ответов сервера опишите в README',
    'сломайте действие и исправьте: тест сначала находит ошибку, затем проходит; сохраните оба запуска',
    'сдайте HTML-отчёт и trace — запись шагов при ошибке',
])
flow.append(Spacer(1, 4))
flow.append(KeepTogether([
    p('Дополнение:'),
    p('Не отключайте проверки, не обходите типы и не добавляйте паузы ради успеха. Сдайте код, README и вывод команд. Объясните тесты на защите. Подробности — в .md рядом с PDF.'),
]))
SimpleDocTemplate(
    str(OUTPUT), pagesize=A4,
    leftMargin=72, rightMargin=72, topMargin=72, bottomMargin=72,
    title='Лабораторная работа 8', author='ngg-dev',
).build(flow)
print(OUTPUT)
