const SYSTEM_PROMPT = `Ты — добрый и терпеливый ИИ-помощник на сайте «ОГЭ — подготовка с нуля».
Твоя главная задача — объяснять ЛЮБОЙ вопрос или тему простым, понятным языком,
так, чтобы понял даже человек, который слышит об этом впервые (уровень ученика 9 класса).

СТИЛЬ:
• Простые слова и короткие предложения. Сложные термины — сразу поясняй «по-человечески».
• Сначала суть в 1–2 фразах, потом разбор.
• Используй аналогии из жизни («это как…») и минимум 1 пример.
• Если тема сложная — разбей на шаги: 1) 2) 3).
• Без воды и «учёного» тона. Можно чуть поддержать, без сюсюканья.
• Не перегружай: лучше короче и понятнее, чем длинно и полно.

ФОРМАТ ОТВЕТА:
1) Коротко — в чём суть
2) Простое объяснение (с аналогией)
3) Пример
4) Если вопрос по школьному предмету — как это встречается на ОГЭ и частая ошибка
5) В конце — один короткий вопрос ученику для самопроверки

Если пользователь просит «объясни проще» — объясняй ещё проще, как для 10-летнего, другими словами и с другой аналогией.

ПРАВИЛА:
• Отвечай на русском языке (если пользователь не пишет на другом).
• Не выдумывай факты, даты, формулы и шкалы баллов. Если не уверен — честно скажи.
• Не пиши целое сочинение/изложение «под сдачу» и не решай целый вариант КИМ подряд — можно план, разбор одного задания, объяснение ошибки.
• На опасные или неподходящие для школьника темы вежливо откажись.
• Используй только простое оформление: **жирный** для главного, списки с «•» или «1)». Без таблиц и LaTeX — формулы пиши обычным текстом (например, a² + b² = c²).

Если вопрос неясный — коротко уточни, что именно хочет узнать пользователь.`;

const SUBJECT_NAMES = {
  russian: 'Русский язык',
  math: 'Математика',
  history: 'История',
  biology: 'Биология',
  physics: 'Физика',
  english: 'Английский язык',
  geography: 'География',
  social: 'Обществознание',
  informatics: 'Информатика',
  literature: 'Литература',
  chemistry: 'Химия',
};

const MODEL = 'claude-sonnet-5-5';

export default async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return Response.json({ error: 'Некорректный запрос' }, { status: 400 });
  }

  const question = String(body.question || '').trim();
  if (!question) return Response.json({ error: 'Пустой вопрос' }, { status: 400 });
  if (question.length > 2000) return Response.json({ error: 'Слишком длинный вопрос' }, { status: 400 });

  const subjectName = SUBJECT_NAMES[body.subject] || '';
  const history = Array.isArray(body.history) ? body.history.slice(-10) : [];

  const baseUrl = (process.env.ANTHROPIC_BASE_URL || '').replace(/\/$/, '');
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!baseUrl || !apiKey) {
    return Response.json({ error: 'ИИ временно недоступен. Попробуйте позже.' }, { status: 500 });
  }

  const messages = [];
  history.forEach(function (h) {
    if (!h || !h.text) return;
    const role = h.role === 'assistant' ? 'assistant' : 'user';
    const content = String(h.text).slice(0, 4000);
    // Anthropic requires alternating roles, starting with user
    if (!messages.length && role !== 'user') return;
    const last = messages[messages.length - 1];
    if (last && last.role === role) last.content += '\n\n' + content;
    else messages.push({ role: role, content: content });
  });
  if (messages.length && messages[messages.length - 1].role === 'user') messages.pop();
  messages.push({ role: 'user', content: question });

  const system = SYSTEM_PROMPT + (subjectName
    ? '\n\nПользователь сейчас на странице предмета «' + subjectName + '». Если вопрос не связан с ним — всё равно ответь.'
    : '');

  try {
    const resp = await fetch(baseUrl + '/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1200,
        system: system,
        messages: messages,
      }),
    });
    const data = await resp.json().catch(() => null);
    if (!resp.ok) {
      const status = resp.status === 429 ? 429 : 502;
      const msg = status === 429
        ? 'Слишком много вопросов сразу. Подождите минутку и попробуйте снова.'
        : 'ИИ сейчас не отвечает. Попробуйте ещё раз.';
      return Response.json({ error: msg }, { status: status });
    }
    const answer = (data && Array.isArray(data.content) ? data.content : [])
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('')
      .trim();
    if (!answer) return Response.json({ error: 'Пустой ответ модели' }, { status: 502 });
    return Response.json({ answer: answer });
  } catch (e) {
    return Response.json({ error: 'Сбой сервера ИИ. Попробуйте позже.' }, { status: 500 });
  }
};

export const config = {
  path: '/api/ai-tutor',
};
