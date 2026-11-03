const CSS = `
.api-diagram{min-width:0;color:#22251f;font-family:inherit}.api-diagram *{box-sizing:border-box}.api-diagram .api-comparison{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}.api-diagram .api-panel{min-width:0;background:#f5f5ee;border:1px solid #daddd1;border-radius:12px;padding:12px}.api-diagram .api-panel h3{font-size:19px;line-height:1.25;margin:0 0 6px}.api-diagram svg{display:block;width:100%;height:auto;font-family:inherit}.api-diagram .api-box{fill:#fffef8;stroke:#cdd1c4;stroke-width:1.5}.api-diagram .api-chip{fill:#fff0cb;stroke:#e5b454}.api-diagram .api-client{fill:#2348ff;stroke:#2348ff}.api-diagram .api-edge{fill:none;stroke:#7b8570;stroke-width:2}.api-diagram .api-white{fill:#fff}.api-diagram .api-label{fill:#22251f;font-size:18px;font-weight:600}.api-diagram .api-small{fill:#6a7162;font-size:16px}.api-diagram .api-chip-label{fill:#785218;font-size:16px}.api-diagram .api-client-label{fill:#fff;font-size:18px;font-weight:600}.api-diagram .api-client-note{fill:#e0e6ff;font-size:16px}.api-diagram .api-fetch-flow{display:grid;grid-template-columns:minmax(0,1fr) 32px minmax(0,1.7fr) 32px minmax(0,1fr);gap:8px;align-items:center;background:#f5f5ee;border-radius:10px;padding:10px 16px;min-height:80px}.api-diagram .api-flow-node{font:18px/1.3 ui-monospace,SFMono-Regular,Menlo,monospace;text-align:center;min-width:0;overflow-wrap:anywhere}.api-diagram .api-flow-client{color:#2348ff}.api-diagram .api-flow-note{display:block;margin-top:5px;font:15px/1.25 system-ui,sans-serif;color:#626a58}.api-diagram .api-flow-arrow{font-size:26px;color:#7b8570;text-align:center}@media(max-width:760px){.api-diagram .api-comparison{grid-template-columns:1fr}.api-diagram .api-panel svg{max-width:560px;margin:auto}.api-diagram .api-fetch-flow{grid-template-columns:1fr;padding:12px}.api-diagram .api-flow-arrow{transform:rotate(90deg);line-height:1}.api-diagram .api-flow-node{font-size:17px}}
`;

// Keep the comparison within the lecture stage even on wide screens.
const SIZE_CSS = '.api-diagram .api-panel svg{max-height:245px}';

function node(tag, className, text) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;
  return element;
}

let diagramId = 0;
function centralization(root) {
  const group = node('div', 'api-comparison');
  const id = `api-request-${++diagramId}`;
  const labels = ['Список книг', 'Поиск', 'Детали'];
  const marker = `<defs><marker id="${id}" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M1 1L7 4L1 7" fill="none" stroke="#7b8570" stroke-width="1.5"/></marker></defs>`;
  const edge = (path) => `<path class="api-edge" d="${path}" marker-end="url(#${id})"/>`;
  const before = node('section', 'api-panel');
  before.append(node('h3', '', 'Сейчас'));
  const beforeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  beforeSvg.setAttribute('viewBox', '0 0 520 245');
  beforeSvg.setAttribute('role', 'img');
  beforeSvg.setAttribute('aria-label', 'Список книг, поиск и детали отправляют запросы серверу API. В каждом месте повторяются адрес /api и заголовок Accept JSON.');
  beforeSvg.innerHTML = `${marker}<text x="321" y="19" class="api-small">Запросы</text>${labels.map((label, i) => {
    const y = 31 + i * 71;
    return `<rect class="api-box" x="4" y="${y}" width="275" height="62" rx="8"/><text class="api-label" x="17" y="${y + 24}">${label}</text><rect class="api-chip" x="17" y="${y + 33}" width="58" height="22" rx="5"/><text class="api-chip-label" x="27" y="${y + 49}">/api</text><rect class="api-chip" x="84" y="${y + 33}" width="126" height="22" rx="5"/><text class="api-chip-label" x="94" y="${y + 49}">Accept: JSON</text>${edge(`M279 ${y + 31}H326L390 122`)}`;
  }).join('')}<rect class="api-box" x="393" y="92" width="119" height="60" rx="9"/><text class="api-label" x="452" y="118" text-anchor="middle">Сервер</text><text class="api-small" x="452" y="140" text-anchor="middle">API</text>`;
  before.append(beforeSvg);
  const after = node('section', 'api-panel');
  after.append(node('h3', '', 'Через общий клиент'));
  const afterSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  afterSvg.setAttribute('viewBox', '0 0 520 245');
  afterSvg.setAttribute('role', 'img');
  afterSvg.setAttribute('aria-label', 'Список книг, поиск и детали отправляют запросы через общий client.js серверу API. Адрес /api и Accept JSON заданы в client.js один раз. Стрелки показывают запросы.');
  afterSvg.innerHTML = `<text x="183" y="19" class="api-small">Запросы →</text>${labels.map((label, i) => {
    const y = 36 + i * 71;
    return `<rect class="api-box" x="4" y="${y}" width="159" height="51" rx="8"/><text class="api-label" x="83" y="${y + 32}" text-anchor="middle">${label}</text>${edge(`M163 ${y + 26}H188L218 122`)}`;
  }).join('')}<rect class="api-client" x="220" y="73" width="164" height="98" rx="9"/><text class="api-client-label" x="302" y="101" text-anchor="middle">client.js</text><text class="api-client-note" x="302" y="130" text-anchor="middle">/api</text><text class="api-client-note" x="302" y="154" text-anchor="middle">Accept: JSON</text>${edge('M384 122H427')}<rect class="api-box" x="430" y="92" width="86" height="60" rx="9"/><text class="api-label" x="473" y="118" text-anchor="middle">Сервер</text><text class="api-small" x="473" y="140" text-anchor="middle">API</text>`;
  after.append(afterSvg);
  group.append(before, after);
  root.append(group);
}

function fetchFlow(root) {
  const flow = node('div', 'api-fetch-flow');
  flow.setAttribute('aria-label', 'Запрос: getBooks вызывает request с путем /books, request отправляет запрос по адресу /api/books.');
  const request = node('div', 'api-flow-node api-flow-client', "request('/books')");
  request.append(node('span', 'api-flow-note', 'Настройки · проверка HTTP · чтение JSON'));
  const arrow = () => { const el = node('span', 'api-flow-arrow', '→'); el.setAttribute('aria-hidden', 'true'); return el; };
  flow.append(node('div', 'api-flow-node', 'getBooks()'), arrow(), request, arrow(), node('div', 'api-flow-node', '/api/books'));
  root.append(flow);
}

/** Mount a static API diagram. The returned cleanup removes its DOM subtree. */
export function mountApiDiagram(container, { type } = {}) {
  if (!['api-centralization', 'fetch-client-flow'].includes(type)) {
    throw new RangeError(`Неизвестная схема API: ${type}`);
  }
  if (!document.getElementById('api-diagram-styles')) {
    const style = node('style');
    style.id = 'api-diagram-styles';
    style.textContent = CSS + SIZE_CSS;
    document.head.append(style);
  }
  const root = node('section', 'api-diagram');
  root.dataset.type = type;
  if (type === 'api-centralization') centralization(root);
  else fetchFlow(root);
  container.append(root);
  return () => root.remove();
}
