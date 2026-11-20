export function escape(text) {
  const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(text).replace(/[&<>"']/g, character => entities[character]);
}

export function renderDiagram(diagram) {
  const { title, nodes, links, module, moduleLabel = 'Модуль каталога', focus = 0, focusModule, interactive } = diagram;
  const connector = index => index < links.length
    ? `<div class="diagram-link"><span>${escape(links[index])}</span><i aria-hidden="true"></i></div>`
    : '';
  const node = index => {
    const [label, description] = nodes[index];
    const body = `<strong>${escape(label)}</strong><span>${escape(description)}</span>`;
    if (interactive) {
      return `<button class="diagram-node" data-diagram-step="${index}" aria-pressed="${index === focus}" type="button">${body}</button>`;
    }
    return `<div class="diagram-node${index === diagram.focus ? ' is-focus' : ''}">${body}</div>`;
  };
  const track = [];
  for (let index = 0; index < nodes.length; index += 1) {
    if (module && index === module[0]) {
      const group = [];
      for (; index <= module[1]; index += 1) {
        group.push(node(index));
        if (index < module[1]) group.push(connector(index));
      }
      index -= 1;
      track.push(`<div class="diagram-module${focusModule ? ' is-focus' : ''}"><span class="module-caption">${escape(moduleLabel)}</span>${group.join('')}</div>`);
    } else {
      track.push(node(index));
    }
    track.push(connector(index));
  }
  return `<figure class="lesson-diagram" aria-label="${escape(title)}">
    <div class="diagram-track">${track.join('')}</div>
    ${interactive ? `<figcaption class="diagram-detail" aria-live="polite">${escape(nodes[focus][2])}</figcaption>` : ''}
  </figure>`;
}

export function renderRecord(record) {
  return `<figure class="mongo-record" aria-label="${escape(record.title)} в MongoDB">
    <div class="mongo-collection"><span>${escape(record.database)}</span><strong>${escape(record.collection)}</strong></div>
    <div class="mongo-document"><h3>${escape(record.title)}</h3><dl>${record.fields.map(([label, value]) =>
      `<div><dt>${escape(label)}</dt><dd>${escape(value)}</dd></div>`).join('')}</dl></div>
  </figure>`;
}

export function renderPatterns(patterns) {
  return `<div class="architecture-patterns">${patterns.map(({ title, nodes, purpose }) => `<article>
    <h3>${escape(title)}</h3><div class="pattern-flow">${nodes.map(label => `<span>${escape(label)}</span>`).join('<i aria-hidden="true">→</i>')}</div>
    <p>${escape(purpose)}</p></article>`).join('')}</div>`;
}
