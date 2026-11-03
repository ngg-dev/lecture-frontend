import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const host = '127.0.0.1';
const port = 4191;
const initialBooks = JSON.parse(await readFile(new URL('./books.json', import.meta.url), 'utf8'));
let books = structuredClone(initialBooks);
let emptyList = false;
let failNextGet = false;

class RequestError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

async function readJson(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (Buffer.byteLength(body) > 64 * 1024) {
      throw new RequestError(413, 'Слишком большое тело запроса');
    }
  }
  try {
    return JSON.parse(body);
  } catch {
    throw new RequestError(400, 'Тело запроса должно содержать корректный JSON');
  }
}

const server = createServer(async (request, response) => {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Cache-Control', 'no-store');

  const pathname = new URL(request.url, `http://${host}:${port}`).pathname;
  const reply = (status, data) => {
    response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    response.end(data === undefined ? undefined : JSON.stringify(data));
    console.log(`${request.method} ${pathname} → ${status}`);
  };

  try {
    if (request.method === 'OPTIONS') {
      reply(204);
      return;
    }

    // Управление условиями упражнения: вызывается через curl из README.
    if (request.method === 'POST' && pathname.startsWith('/__lab/')) {
      if (pathname === '/__lab/empty') emptyList = true;
      else if (pathname === '/__lab/restore') emptyList = false;
      else if (pathname === '/__lab/fail-next-get') failNextGet = true;
      else if (pathname === '/__lab/reset') {
        books = structuredClone(initialBooks);
        emptyList = false;
        failNextGet = false;
      } else {
        reply(404, { message: 'Команда упражнения не найдена' });
        return;
      }
      reply(200, { emptyList, failNextGet, message: 'Условие изменено. Запустите запрос в React-приложении.' });
      return;
    }

    const isList = pathname === '/api/books';
    const detailMatch = pathname.match(/^\/api\/books\/([^/]+)$/);
    if (!isList && !detailMatch) {
      reply(404, { message: 'Адрес не найден' });
      return;
    }

    if (request.method === 'GET' && failNextGet) {
      failNextGet = false;
      reply(500, { message: 'Учебная ошибка. Следующий запрос можно повторить.' });
      return;
    }

    if (request.method === 'GET' && isList) {
      reply(200, { books: emptyList ? [] : books });
      return;
    }

    if (detailMatch && (request.method === 'GET' || request.method === 'PATCH')) {
      let id;
      try { id = decodeURIComponent(detailMatch[1]); }
      catch { throw new RequestError(400, 'Некорректный id в адресе'); }
      const book = books.find(item => String(item.id) === id);
      if (!book) {
        reply(404, { message: 'Книга не найдена' });
        return;
      }

      if (request.method === 'PATCH') {
        const body = await readJson(request);
        if (typeof body?.price !== 'number' || !Number.isFinite(body.price) || body.price < 0) {
          throw new RequestError(400, 'price должно быть конечным числом не меньше нуля');
        }
        book.price = body.price;
      }
      reply(200, { book });
      return;
    }

    response.setHeader('Allow', isList ? 'GET, OPTIONS' : 'GET, PATCH, OPTIONS');
    reply(405, { message: 'Метод не поддерживается для этого адреса' });
  } catch (error) {
    reply(error.status || 500, { message: error.status ? error.message : 'Ошибка учебного сервера' });
  }
});

server.on('error', error => {
  console.error(error.code === 'EADDRINUSE'
    ? `Порт ${port} занят. Остановите ранее запущенный сервер клавишами Ctrl+C.`
    : error.message);
  process.exitCode = 1;
});

server.listen(port, host, () => {
  console.log(`Учебный API: http://${host}:${port}/api/books`);
  console.log('Изменения живут в памяти до перезапуска. Остановить: Ctrl+C.');
});
