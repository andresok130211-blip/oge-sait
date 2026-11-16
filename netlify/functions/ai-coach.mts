import type { Config } from "@netlify/functions";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "../../db/index.js";
import { coachMistakes, coachProfiles, coachStats } from "../../db/schema.js";

const SUBJECT_NAMES: Record<string, string> = {
  russian: "Русский язык",
  math: "Математика",
  history: "История",
  biology: "Биология",
  physics: "Физика",
  english: "Английский язык",
  geography: "География",
  social: "Обществознание",
  informatics: "Информатика",
  literature: "Литература",
  chemistry: "Химия",
};

const MODEL = "claude-sonnet-5-5";
// Regenerate the AI plan at most this often when new answers arrive
const REGEN_MIN_MS = 3 * 60 * 1000;
// ...and at least this often, so hints stay fresh even without new answers
const REGEN_MAX_MS = 24 * 60 * 60 * 1000;

type Hint = { title: string; text: string; subject?: string };
type Mission = { subject: string; topic?: string; title: string; desc: string };

const GENERIC_HINTS: Hint[] = [
  { title: "15 минут каждый день", text: "Короткая практика каждый день работает лучше, чем 3 часа раз в неделю. Мозг запоминает через повторение." },
  { title: "Ошибка — это подсказка", text: "Каждая ошибка показывает, что повторить. Нажми «Работа над ошибками» — я дам эти вопросы ещё раз." },
  { title: "Читай вопрос до конца", text: "Половина ошибок на ОГЭ — из-за невнимательности. Подчеркни главное слово в вопросе: «НЕ», «верно», «неверно»." },
  { title: "Сначала теория — потом тест", text: "Если в теме много ошибок, сначала перечитай короткую теорию в уроке, а потом пройди тест снова." },
  { title: "Объясни сам себе", text: "Попробуй пересказать правило своими словами. Если не получается — спроси ИИ-репетитора 🤖 внизу справа." },
  { title: "Чередуй предметы", text: "Решай понемногу из разных предметов — так знания держатся дольше, чем при зубрёжке одной темы." },
];

function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: { "Cache-Control": "no-store" } });
}

function validUid(uid: unknown): uid is string {
  return typeof uid === "string" && /^[a-zA-Z0-9-]{16,64}$/.test(uid);
}

function clip(v: unknown, n: number) {
  return String(v ?? "").replace(/\s+/g, " ").trim().slice(0, n);
}

async function bumpEvents(uid: string, n: number) {
  await db
    .insert(coachProfiles)
    .values({ userId: uid, events: n })
    .onConflictDoUpdate({ target: coachProfiles.userId, set: { events: sql`${coachProfiles.events} + ${n}` } });
}

async function handleEvents(body: any) {
  const uid = body?.uid;
  if (!validUid(uid)) return json({ error: "bad uid" }, 400);
  const events = Array.isArray(body.events) ? body.events.slice(0, 40) : [];
  let count = 0;

  for (const ev of events) {
    const subject = String(ev?.subject || "");
    if (!SUBJECT_NAMES[subject]) continue;
    const question = clip(ev.question, 500);
    if (!question) continue;
    const isWrong = ev.type === "wrong";
    count++;

    await db
      .insert(coachStats)
      .values({ userId: uid, subject, correct: isWrong ? 0 : 1, wrong: isWrong ? 1 : 0 })
      .onConflictDoUpdate({
        target: [coachStats.userId, coachStats.subject],
        set: {
          correct: sql`${coachStats.correct} + ${isWrong ? 0 : 1}`,
          wrong: sql`${coachStats.wrong} + ${isWrong ? 1 : 0}`,
          updatedAt: new Date(),
        },
      });

    const existing = await db
      .select({ id: coachMistakes.id })
      .from(coachMistakes)
      .where(and(eq(coachMistakes.userId, uid), eq(coachMistakes.question, question), eq(coachMistakes.resolved, false)))
      .limit(1);

    if (isWrong) {
      if (existing.length) continue;
      const options = Array.isArray(ev.options) ? ev.options.slice(0, 6).map((o: unknown) => clip(o, 200)).filter(Boolean) : [];
      await db.insert(coachMistakes).values({
        userId: uid,
        subject,
        topic: clip(ev.topic, 160),
        question,
        chosen: clip(ev.chosen, 200),
        correct: clip(ev.correct, 300),
        options,
      });
    } else if (existing.length) {
      // Student answered a previously failed question correctly — mistake is fixed
      await db.update(coachMistakes).set({ resolved: true }).where(eq(coachMistakes.id, existing[0].id));
    }
  }

  if (count) await bumpEvents(uid, count);
  return json({ ok: true, saved: count });
}

async function handleResolve(body: any) {
  const uid = body?.uid;
  const id = Number(body?.id);
  if (!validUid(uid) || !Number.isInteger(id)) return json({ error: "bad request" }, 400);
  const correct = !!body.correct;
  const [m] = await db
    .select()
    .from(coachMistakes)
    .where(and(eq(coachMistakes.id, id), eq(coachMistakes.userId, uid)))
    .limit(1);
  if (!m) return json({ error: "not found" }, 404);
  if (correct) await db.update(coachMistakes).set({ resolved: true }).where(eq(coachMistakes.id, id));
  await db
    .insert(coachStats)
    .values({ userId: uid, subject: m.subject, correct: correct ? 1 : 0, wrong: correct ? 0 : 1 })
    .onConflictDoUpdate({
      target: [coachStats.userId, coachStats.subject],
      set: {
        correct: sql`${coachStats.correct} + ${correct ? 1 : 0}`,
        wrong: sql`${coachStats.wrong} + ${correct ? 0 : 1}`,
        updatedAt: new Date(),
      },
    });
  await bumpEvents(uid, 1);
  return json({ ok: true });
}

type StatRow = { subject: string; correct: number; wrong: number };
type MistakeRow = typeof coachMistakes.$inferSelect;

function weakestSubject(stats: StatRow[], mistakes: MistakeRow[]): string {
  const score: Record<string, number> = {};
  for (const m of mistakes) score[m.subject] = (score[m.subject] || 0) + 2;
  for (const s of stats) {
    const total = s.correct + s.wrong;
    if (total) score[s.subject] = (score[s.subject] || 0) + (s.wrong / total) * 5;
  }
  const best = Object.entries(score).sort((a, b) => b[1] - a[1])[0];
  if (best) return best[0];
  // No data yet — pick a subject the student hasn't touched, rotating daily
  const keys = Object.keys(SUBJECT_NAMES);
  const untouched = keys.filter((k) => !stats.some((s) => s.subject === k));
  const pool = untouched.length ? untouched : keys;
  return pool[Math.floor(Date.now() / 86400000) % pool.length];
}

function fallbackPlan(stats: StatRow[], mistakes: MistakeRow[]): { hints: Hint[]; mission: Mission } {
  const hints: Hint[] = [];
  for (const m of mistakes.slice(0, 5)) {
    hints.push({
      subject: m.subject,
      title: `${SUBJECT_NAMES[m.subject]}${m.topic ? " · " + m.topic : ""}`,
      text: `Ты ошибся в вопросе «${m.question.slice(0, 120)}».${m.correct ? " Правильно: " + m.correct.slice(0, 120) + "." : ""} Повтори эту тему и попробуй ещё раз.`,
    });
  }
  hints.push(...GENERIC_HINTS);
  const subject = weakestSubject(stats, mistakes);
  const topic = mistakes.find((m) => m.subject === subject && m.topic)?.topic;
  return {
    hints: hints.slice(0, 10),
    mission: {
      subject,
      topic,
      title: `${SUBJECT_NAMES[subject]}${topic ? " · " + topic : ""}`,
      desc: mistakes.length
        ? "Здесь больше всего ошибок. Повтори теорию и реши тест темы ещё раз — ошибки исчезнут из списка."
        : "Начни с этого предмета: пройди один урок и тест — я запомню результат и подберу следующее задание.",
    },
  };
}

function extractJson(text: string): any {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end <= start) return null;
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

async function aiPlan(stats: StatRow[], mistakes: MistakeRow[]): Promise<{ hints: Hint[]; mission: Mission } | null> {
  const baseUrl = (process.env.ANTHROPIC_BASE_URL || "").replace(/\/$/, "");
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!baseUrl || !apiKey) return null;

  const statsText = stats.length
    ? stats.map((s) => `- ${s.subject} (${SUBJECT_NAMES[s.subject]}): верно ${s.correct}, ошибок ${s.wrong}`).join("\n")
    : "Пока нет ответов.";
  const mistakesText = mistakes.length
    ? mistakes
        .slice(0, 25)
        .map(
          (m, i) =>
            `${i + 1}. [${m.subject}] тема «${m.topic || "—"}»: вопрос «${m.question.slice(0, 200)}»; ответил «${m.chosen || "?"}»; правильно «${m.correct || "?"}»`
        )
        .join("\n")
    : "Пока нет ошибок.";

  const system = `Ты — личный ИИ-наставник ученика 9 класса на сайте подготовки к ОГЭ. Ты управляешь его обучением:
анализируешь ошибки и статистику и решаешь, что ему делать дальше. Пиши по-русски, просто, дружелюбно, коротко.
Не выдумывай факты. Отвечай ТОЛЬКО валидным JSON без пояснений и без markdown.`;

  const user = `Статистика по предметам:
${statsText}

Нерешённые ошибки ученика (самые свежие сверху):
${mistakesText}

Коды предметов: ${Object.keys(SUBJECT_NAMES).join(", ")}.

Составь JSON строго такого вида:
{
  "mission": {"subject": "<код предмета>", "topic": "<тема из списка ошибок или пустая строка>", "title": "<короткий заголовок задания, до 50 символов>", "desc": "<что конкретно сделать сегодня, 1–2 предложения>"},
  "hints": [{"subject": "<код предмета или пустая строка>", "title": "<до 45 символов>", "text": "<подсказка 1–3 предложения>"}]
}

Правила:
• mission — самое полезное задание на сегодня: тема/предмет с наибольшим числом ошибок. Если ошибок нет — предмет, который ученик ещё не пробовал.
• hints — от 8 до 10 штук. Большинство — по конкретным ошибкам: объясни, почему правильный ответ правильный, дай правило или приём запоминания. Остальные — общие советы по подготовке к ОГЭ и мотивация.
• Не повторяй одну и ту же мысль дважды.`;

  try {
    const resp = await fetch(baseUrl + "/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: MODEL, max_tokens: 2500, system, messages: [{ role: "user", content: user }] }),
    });
    if (!resp.ok) return null;
    const data: any = await resp.json().catch(() => null);
    const text = (Array.isArray(data?.content) ? data.content : [])
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("");
    const parsed = extractJson(text);
    if (!parsed) return null;

    const hints: Hint[] = (Array.isArray(parsed.hints) ? parsed.hints : [])
      .map((h: any) => ({
        title: clip(h?.title, 80),
        text: clip(h?.text, 500),
        subject: SUBJECT_NAMES[h?.subject] ? h.subject : undefined,
      }))
      .filter((h: Hint) => h.title && h.text)
      .slice(0, 12);
    const m = parsed.mission || {};
    if (!hints.length || !SUBJECT_NAMES[m.subject]) return null;
    return {
      hints,
      mission: {
        subject: m.subject,
        topic: clip(m.topic, 160) || undefined,
        title: clip(m.title, 80) || SUBJECT_NAMES[m.subject],
        desc: clip(m.desc, 300),
      },
    };
  } catch {
    return null;
  }
}

async function handleGet(url: URL) {
  const uid = url.searchParams.get("uid");
  if (!validUid(uid)) return json({ error: "bad uid" }, 400);
  const force = url.searchParams.get("refresh") === "1";

  const [stats, mistakes, profileRows] = await Promise.all([
    db
      .select({ subject: coachStats.subject, correct: coachStats.correct, wrong: coachStats.wrong })
      .from(coachStats)
      .where(eq(coachStats.userId, uid)),
    db
      .select()
      .from(coachMistakes)
      .where(and(eq(coachMistakes.userId, uid), eq(coachMistakes.resolved, false)))
      .orderBy(desc(coachMistakes.createdAt))
      .limit(60),
    db.select().from(coachProfiles).where(eq(coachProfiles.userId, uid)).limit(1),
  ]);
  let profile = profileRows[0];

  const age = profile?.generatedAt ? Date.now() - new Date(profile.generatedAt).getTime() : Infinity;
  const hasNew = !profile || profile.events > profile.eventsAtGen;
  const stale = age === Infinity || age > REGEN_MAX_MS || (hasNew && age > REGEN_MIN_MS) || (force && age > 60 * 1000);

  let hints = profile?.hints || [];
  let mission = profile?.mission || null;
  let source = "ai";

  if (stale || !hints.length) {
    const plan = await aiPlan(stats, mistakes);
    if (plan) {
      hints = plan.hints;
      mission = plan.mission;
      const events = profile?.events || 0;
      await db
        .insert(coachProfiles)
        .values({ userId: uid, hints, mission, events, eventsAtGen: events, generatedAt: new Date() })
        .onConflictDoUpdate({
          target: coachProfiles.userId,
          set: { hints, mission, eventsAtGen: events, generatedAt: new Date() },
        });
    } else if (!hints.length) {
      const fb = fallbackPlan(stats, mistakes);
      hints = fb.hints;
      mission = fb.mission;
      source = "basic";
    }
  }

  const bySubject: Record<string, number> = {};
  for (const m of mistakes) bySubject[m.subject] = (bySubject[m.subject] || 0) + 1;
  const topics: Record<string, Record<string, number>> = {};
  for (const m of mistakes) {
    if (!m.topic) continue;
    topics[m.subject] = topics[m.subject] || {};
    topics[m.subject][m.topic] = (topics[m.subject][m.topic] || 0) + 1;
  }

  return json({
    source,
    hints,
    mission,
    stats,
    mistakesCount: mistakes.length,
    bySubject,
    topics,
    practice: mistakes
      .filter((m) => m.options.length >= 2 && m.correct)
      .slice(0, 10)
      .map((m) => ({ id: m.id, subject: m.subject, topic: m.topic, question: m.question, options: m.options, correct: m.correct })),
  });
}

export default async (req: Request) => {
  const url = new URL(req.url);
  try {
    if (req.method === "GET") return await handleGet(url);
    if (req.method === "POST") {
      // sendBeacon posts text/plain, so parse the body manually
      const body = await req.text().then((t) => JSON.parse(t)).catch(() => null);
      if (!body) return json({ error: "bad json" }, 400);
      if (url.pathname.endsWith("/event")) return await handleEvents(body);
      if (url.pathname.endsWith("/resolve")) return await handleResolve(body);
    }
    return json({ error: "not found" }, 404);
  } catch (e) {
    console.error("ai-coach error", e);
    return json({ error: "Сбой сервера наставника" }, 500);
  }
};

export const config: Config = {
  path: ["/api/coach", "/api/coach/event", "/api/coach/resolve"],
};
