import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chapters, slides, totalMinutes, sources, extraSlides } from '../src/content.js';
export async function writeGuide(root) {
  let text = `# Обозреваем TS – план преподавателя\n\nСлайдов: ${slides.length}; ориентир ${totalMinutes} минут. Основной рассказ рассчитан на 68 минут; ещё 5 минут оставляем на вопросы. useRef, useEffect и собственный хук вынесены в дополнительные материалы.\n`;
  for (const chapter of chapters) {
    const items = slides.filter(slide => slide.chapter === chapter.id);
    text += `\n## ${chapter.title} · ${items.reduce((n, slide) => n + slide.minutes, 0)} мин\n`;
    for (const slide of items) {
      text += `\n### ${slides.indexOf(slide) + 1}. ${slide.title.replaceAll('\n', ' ')} · ${slide.minutes} мин\n\n`;
      text += `Слайд: \`#${slide.id}\`\n\n${slide.notes}\n`;
      if (slide.takeaway) text += `\nВывод: ${slide.takeaway}\n`;
      if (slide.sources) text += '\nИсточники: ' + slide.sources.map(key => `[${sources[key][0]}](${sources[key][1]})`).join(', ') + '.\n';
    }
  }
  await writeFile(resolve(root, 'docs/speaker-guide.md'), text);
  let extra = '# Дополнительные темы TypeScript\n\nЭти темы сохранены для самостоятельного чтения и не входят в основной показ. Сначала пройдите типизацию данных, утилиты и применение в React. Намеренные ошибки в примерах обозначены комментариями.\n';
  for (const slide of extraSlides) {
    extra += `\n## ${slide.title}\n\n${slide.lead}\n`;
    if (slide.code) extra += `\n\`\`\`${slide.code.file?.endsWith('.tsx') ? 'tsx' : 'ts'}\n${slide.code.text}\n\`\`\`\n`;
    if (slide.takeaway) extra += `\n${slide.takeaway}\n`;
    extra += `\n${slide.notes}\n`;
    if (slide.sources) extra += '\nИсточники: ' + slide.sources.map(key => `[${sources[key][0]}](${sources[key][1]})`).join(', ') + '.\n';
  }
  await writeFile(resolve(root, 'docs/extra-topics.md'), extra);
}
